import express, { Router } from "express";
import { medicineController } from "./medicine.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", medicineController.getAllMedicines);
router.get("/:medicineId", medicineController.getMedicineDetails);

router.post(
  "/medicines",
  auth(UserRole.SELLER, UserRole.CUSTOMER, UserRole.ADMIN),
  medicineController.addMedicine,
);
router.put(
  "/medicines/:medicineId",
  auth(UserRole.SELLER),
  medicineController.updateMedicine,
);

router.delete(
  "/medicines/:medicineId",
  auth(UserRole.SELLER),
  medicineController.deleteMedicine,
);

export const medicineRouter: Router = router;
