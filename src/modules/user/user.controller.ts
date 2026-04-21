import { Request, Response } from "express";
import { userService } from "./user.service";
import { UserRole } from "../../middlewares/auth";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all the users",
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

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const { status } = req.body;

    const result = await userService.updateUserStatus(userId as string, status);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update This User Status..!!",
      details: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized!!");
    }
    const { userId } = req.params;

    const isAdmin = user.role === UserRole.ADMIN;

    const result = await userService.deleteUser(userId as string, isAdmin);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This User!!",
      details: error,
    });
  }
};

export const userController = {
  getAllUsers,
  getCurrentUser,
  updateUserStatus,
  deleteUser,
};
