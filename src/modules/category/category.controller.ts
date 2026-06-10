import { Request, Response } from "express";
import { categoryService } from "./category.service";
import { UserRole } from "../../middlewares/auth";

const createCategory = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.createCategory(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
      details: error,
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all categories..!!!",
      details: error,
    });
  }
};

const deleteCategories = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized !!");
    }

    const { categoryId } = req.params;
    const isAdmin = user.role === UserRole.ADMIN;
    const result = await categoryService.deleteCategory(
      categoryId as string,
      isAdmin,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This Category!!!",
      details: error,
    });
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  deleteCategories,
};
