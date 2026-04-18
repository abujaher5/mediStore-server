import express, { Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  // auth(UserRole.ADMIN, UserRole.SELLER),
  userController.getAllUsers,
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  userController.getCurrentUser,
);
router.patch(
  "/:userId",
  auth(UserRole.ADMIN, UserRole.SELLER),
  userController.updateOrderStatus,
);

export const userRouter: Router = router;
