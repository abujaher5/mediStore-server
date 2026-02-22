import { Request, Response } from "express";
import { userService } from "./user.service";

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

export const userController = {
  getAllUsers,
  getCurrentUser,
};
