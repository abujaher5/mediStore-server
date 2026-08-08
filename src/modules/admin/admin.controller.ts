import { Request, Response } from "express";
import { UserRole } from "../../middlewares/auth";
import { adminService } from "./admin.service";
import { asyncHandler } from "../../shared/asyncHandler";
import { sendResponse } from "../../shared/sendResponse";
import { UserStatus } from "../../generated/prisma/enums";

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;
  const result = await adminService.getAllUsers(
    status as UserStatus | "ALL" | undefined,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "all users get successfully",
    data: result,
  });
});

const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
  const result = await adminService.getAdminStats();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "admin stats get successfully",
    data: result,
  });
});

const getCurrentUser = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new Error("You are unauthorized!!");
  }
  const { userId } = req.params;
  const isAdmin = user.role === UserRole.ADMIN;
  await adminService.deleteUser(
    userId as string,
    isAdmin,
    req.user?.id as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User deleted successfully",
  });
});

const restoreUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = req.params.userId;
  const isAdmin = user?.role === UserRole.ADMIN;
  if (!user) {
    throw new Error("You are unauthorized!!");
  }

  const result = await adminService.restoreUser(
    userId as string,
    isAdmin,
    user.id,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User restored successfully from controller",
    data: result,
  });
});

export const adminController = {
  getAllUsers,
  getCurrentUser,
  // updateUserStatus,
  deleteUser,
  getAdminStats,
  restoreUser,
};
