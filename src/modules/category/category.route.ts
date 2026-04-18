import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post(
  "/admin/categories",
  auth(UserRole.ADMIN),
  categoryController.createCategory,
);
router.get("/admin/categories", categoryController.getAllCategories);

export const categoryRouter: Router = router;
