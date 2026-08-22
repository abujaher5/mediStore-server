import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { UserStatus } from "../../generated/prisma/enums";
import { User } from "../../generated/prisma/client";
import { ApiError } from "../../errorHelpers/ApiError";

interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
}

const getAllUsers = async (status: string) => {
  const result = await prisma.user.findMany({
    where: { status: status as UserStatus },
  });

  return result;
};

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: new Headers(req.headers as Record<string, string>),
  });
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User is not found..",
    });
  }
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "Customer",
    emailVerified: user.emailVerified,
    status: user.status,
  };
  next();
};
const updateUserStatus = async (userId: string, status: UserStatus) => {
  await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  });

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });
  return result;
};

const updateProfile = async (userId: string, payload: UpdateProfilePayload) => {
  const { name, email, phone } = payload;

  const existingUser = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new ApiError(400, "This email is already in use");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, email, phone },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (userId: string, isAdmin: boolean) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!isAdmin && userData.id !== userId) {
    throw new Error("You are not admin to delete user..");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  await prisma.session.deleteMany({
    where: { userId },
  });

  return { success: true, message: "User deleted successfully" };
};

export const userService = {
  getAllUsers,
  getCurrentUser,
  updateUserStatus,
  updateProfile,
  deleteUser,
};
