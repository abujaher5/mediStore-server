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
  "/orders",
  auth(UserRole.SELLER),
  sellerControllers.getOrderedMedicines,
);

router.patch(
  "/orders/:orderId",
  auth(UserRole.SELLER),
  sellerControllers.updateOrderStatus,
);
router.put(
  "/medicines/:medicineId",
  auth(UserRole.SELLER),
  sellerControllers.updateMedicine,
);

router.delete(
  "/medicines/:medicineId",
  auth(UserRole.SELLER),
  sellerControllers.deleteMedicine,
);

export const sellerRouter: Router = router;
