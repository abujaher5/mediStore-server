import express, { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = express.Router();

router.get("/", medicineController.getAllMedicines);
// router.get("/:id");

export const medicineRouter: Router = router;
