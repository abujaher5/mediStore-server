import express, { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", medicineController.getAllMedicines);

router.post(
  "/medicines",
  auth(UserRole.SELLER, UserRole.CUSTOMER, UserRole.ADMIN),
  medicineController.addMedicine,
);
// router.get("/:id");

export const medicineRouter: Router = router;
