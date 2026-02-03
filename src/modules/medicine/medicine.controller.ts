import { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const getAllMedicines = async (req: Request, res: Response) => {
  try {
    const result = await medicineService.getAllMedicines();

    console.log("Get so many medicine", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all medicines",
      details: error,
    });
  }
};

export const medicineController = {
  getAllMedicines,
};
