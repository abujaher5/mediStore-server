import express, { Router } from "express";

import auth, { UserRole } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get(
  "/",
  //  auth(UserRole.ADMIN),
  adminController.getAllUsers,
);

router.get(
  "/dashboard-stats",
  auth(UserRole.ADMIN),
  adminController.getAdminStats,
);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  adminController.getCurrentUser,
);
// router.patch(
//   "/:userId",
//   auth(UserRole.ADMIN, UserRole.SELLER),
//   adminController.updateUserStatus,
// );
router.patch("/:userId", auth(UserRole.ADMIN), adminController.restoreUser);

router.delete("/:userId", auth(UserRole.ADMIN), adminController.deleteUser);

export const adminRouter: Router = router;
