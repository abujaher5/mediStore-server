import express, { Router } from "express";
import { userController } from "./user.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  userController.getCurrentUser,
);

router.patch(
  "/profile",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER),
  userController.updateProfile,
);
router.patch(
  "/:userId",
  auth(UserRole.ADMIN, UserRole.SELLER),
  userController.updateUserStatus,
);

router.delete("/:userId", auth(UserRole.ADMIN), userController.deleteUser);

export const userRouter: Router = router;
