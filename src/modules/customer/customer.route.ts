import express, { Router } from "express";

import auth, { UserRole } from "../../middlewares/auth";
import { customerController } from "./customer.controller";

const router = express.Router();

router.get(
  "/dashboard-stats",
  auth(UserRole.CUSTOMER),
  customerController.getCustomerStats,
);

export const customerRouter: Router = router;
