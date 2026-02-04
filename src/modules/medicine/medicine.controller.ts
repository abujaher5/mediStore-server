import { Request, Response } from "express";
import { medicineService } from "./medicine.service";

const addMedicine = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    // console.log("user", user);

    if (!sellerId) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const result = await medicineService.addMedicine(
      req.body,
      sellerId as string,
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
      details: error,
    });
  }
};

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
  addMedicine,
};
