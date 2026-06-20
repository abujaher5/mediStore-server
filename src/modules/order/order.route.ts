import express, { Router } from "express";
import { orderController } from "./order.controller";

import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/my-orders", auth(UserRole.CUSTOMER), orderController.getMyOrders);
router.get(
  "/:orderId",
  auth(UserRole.CUSTOMER),
  orderController.getOrderDetails,
);

export const orderRouter: Router = router;
