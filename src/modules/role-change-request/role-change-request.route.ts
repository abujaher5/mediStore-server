import express, { Router } from "express";

import auth, { UserRole } from "../../middlewares/auth";
import { roleChangeRequestController } from "./role-change-request.controller";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER, UserRole.SELLER),
  roleChangeRequestController.createRoleChangeRequest,
);

router.get(
  "/my-requests",
  auth(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
  roleChangeRequestController.getMyRequests,
);

router.get(
  "/",
  auth(UserRole.ADMIN),
  roleChangeRequestController.getAllRequests,
);

router.patch(
  "/:requestId/role",
  auth(UserRole.ADMIN),
  roleChangeRequestController.updateRequestRole,
);

router.patch(
  "/:requestId/approve",
  auth(UserRole.ADMIN),
  roleChangeRequestController.approveRequest,
);

router.patch(
  "/:requestId/reject",
  auth(UserRole.ADMIN),
  roleChangeRequestController.rejectRequest,
);

export const roleChangeRequestRouter: Router = router;
