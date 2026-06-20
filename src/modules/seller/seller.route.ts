import express, { Router } from "express";

import auth, { UserRole } from "../../middlewares/auth";
import { sellerControllers } from "./seller.controller";

const router = express.Router();

router.post(
  "/medicines",
  auth(UserRole.SELLER, UserRole.CUSTOMER, UserRole.ADMIN),
  sellerControllers.addMedicine,
);

router.get(
  "/my-medicines",
  auth(UserRole.SELLER),
  sellerControllers.getMyMedicines,
);
router.get(
  "/medicines/dashboard-stats",
  auth(UserRole.SELLER),
  sellerControllers.getSellerStats,
);

router.get(
  "/orders",
  auth(UserRole.SELLER),
  sellerControllers.getOrderedMedicines,
);

router.patch(
  "/orders/:orderId",
  auth(UserRole.SELLER),
  sellerControllers.updateOrderStatus,
);
router.patch(
  "/medicines/:medicineId",
  auth(UserRole.SELLER),
  sellerControllers.updateStock,
);
router.patch(
  "/medicines/updateMedicine/:medicineId",
  auth(UserRole.SELLER),
  sellerControllers.updateMedicine,
);

router.delete(
  "/medicines/:medicineId",
  auth(UserRole.SELLER),
  sellerControllers.deleteMedicine,
);

export const sellerRouter: Router = router;
