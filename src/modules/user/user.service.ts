import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

const getAllUsers = async () => {
  return await prisma.user.findMany();
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
  };
  next();
};
const updateUserStatus = async (userId: string, status: string) => {
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

const deleteUser = async (userId: string, isAdmin: string) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    // select: {
    //   id: true,
    //   userId: true,
    // },
  });

  console.log(userData);

  if (!isAdmin && userData.id !== userId) {
    throw new Error("You are not admin to delete user..");
  }
  return await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export const userService = {
  getAllUsers,
  getCurrentUser,
  updateUserStatus,
  deleteUser,
};
