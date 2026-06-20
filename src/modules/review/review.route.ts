import express, { Router } from "express";
import { reviewController } from "./review.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-review",
  auth(UserRole.CUSTOMER),
  reviewController.createReview,
);

router.get("/all-reviews", reviewController.getAllReviews);

export const reviewRouter: Router = router;
