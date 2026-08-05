import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { UserStatus } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";

const getAdminStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalSellers = await prisma.user.count({
    where: {
      role: "SELLER",
    },
  });
  const totalCustomers = await prisma.user.count({
    where: {
      role: "CUSTOMER",
    },
  });
  const totalMedicines = await prisma.medicine.count();
  const totalOrders = await prisma.order.count();

  return {
    totalUsers,
    totalSellers,
    totalCustomers,
    totalMedicines,
    totalOrders,
  };
};

const getAllUsers = async (status: UserStatus | "ALL" | undefined) => {
  const where: Prisma.UserWhereInput =
    status && status !== "ALL" ? { status } : {};
  const result = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
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
  };
  next();
};
// const updateUserStatus = async (userId: string, status: UserStatus) => {
//   await prisma.user.findFirstOrThrow({
//     where: {
//       id: userId,
//     },
//   });

//   const result = await prisma.user.update({
//     where: { id: userId },
//     data: { status },
//   });
//   return result;
// };

const deleteUser = async (
  userId: string,
  isAdmin: boolean,
  loggedInUserId: string,
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (!isAdmin && loggedInUserId !== userId) {
    throw new Error("You are not admin to delete user..");
  }
  if (userData.status === UserStatus.DELETED) {
    throw new Error("User is already deleted");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.DELETED,
      },
    }),

    prisma.session.deleteMany({
      where: { userId },
    }),
  ]);

  return { success: true, message: "User deleted successfully" };
};

const restoreUser = async (
  userId: string,
  isAdmin: boolean,
  loggedInUserId: string,
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });
  if (!isAdmin && loggedInUserId !== userId) {
    throw new Error("You are not admin to restore user..");
  }

  if (userData.status === UserStatus.ACTIVE) {
    throw new Error("User is already active");
  }

  const restoredUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: UserStatus.ACTIVE,
    },
  });

  return {
    success: true,
    message: "User restored successfully",
    data: restoredUser,
  };
};

export const adminService = {
  getAdminStats,
  getAllUsers,
  getCurrentUser,

  deleteUser,
  restoreUser,
};
