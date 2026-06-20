import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.patch(
  "/:categoryId",
  auth(UserRole.ADMIN),
  categoryController.updateCategoryName,
);

router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  categoryController.deleteCategories,
);

export const categoryRouter: Router = router;
