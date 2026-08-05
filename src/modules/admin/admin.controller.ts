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

const getAdminStats = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAdminStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get admin stats",
      details: error,
    });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
};

// const updateUserStatus = async (req: Request, res: Response) => {
//   try {
//     const userId = req.params.userId;

//     const { status } = req.body;

//     const result = await adminService.updateUserStatus(
//       userId as string,
//       status,
//     );
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(400).json({
//       error: "Cannot Update This User Status..!!",
//       details: error,
//     });
//   }
// };

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized!!");
    }
    const { userId } = req.params;

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await adminService.deleteUser(
      userId as string,
      isAdmin,
      req.user?.id as string,
    );

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: "Cannot Delete This User!!",
      details: error,
    });
  }
};

const restoreUser = asyncHandler(async (req: Request, res: Response) => {
  try {
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

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: "Cannot Restore This User!!",
      details: error,
    });
  }
});

export const adminController = {
  getAllUsers,
  getCurrentUser,
  // updateUserStatus,
  deleteUser,
  getAdminStats,
  restoreUser,
};
