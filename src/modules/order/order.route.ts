import express, { Router } from "express";
import { orderController } from "./order.controller";

import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.CUSTOMER), orderController.createOrder);
router.get("/", auth(UserRole.CUSTOMER), orderController.getAllOrders);
router.get("/myOrders", auth(UserRole.CUSTOMER), orderController.getMyOrders);
router.get(
  "/:orderId",
  auth(UserRole.CUSTOMER),
  orderController.getOrderDetails,
);

export const orderRouter: Router = router;
