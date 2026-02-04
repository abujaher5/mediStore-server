import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    // const sellerId = req.user?.id;
    // console.log("user", user);

    // if (!sellerId) {
    //   return res.status(400).json({
    //     error: "Unauthorized!",
    //   });
    // }
    const result = await categoryService.createCategory(
      req.body,
      //   sellerId as string,
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
      details: error,
    });
  }
};

export const categoryController = {
  createCategory,
};
