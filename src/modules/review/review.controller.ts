import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // from auth middleware
    const { quote, designation } = req.body;

    const result = await reviewService.createReview(userId as string, {
      quote,
      designation,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllReviews = async (req: Request, res: Response) => {
  try {
    const result = await reviewService.getAllReviews();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewController = {
  createReview,
  getAllReviews,
};
