import { Request, Response } from "express";
import { medicineService } from "./medicine.service";
import { UserRole } from "../../middlewares/auth";

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
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    const result = await medicineService.getAllMedicines({
      search: searchString,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all medicines",
      details: error,
    });
  }
};

const getMedicineDetails = async (req: Request, res: Response) => {
  try {
    const { medicineId } = req.params;

    if (!medicineId) {
      throw new Error("Medicine id is required!!");
    }
    const result = await medicineService.getMedicineDetails(
      medicineId as string,
    );
    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get  medicines details..!!",
      details: error,
    });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are unauthorized..!!");
    }

    const { medicineId } = req.params;
    const isSeller = user.role === UserRole.SELLER;
    const result = await medicineService.updateMedicine(
      medicineId as string,
      req.body,
      user.id,
      isSeller,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update  Medicines Details..!!",
      details: error,
    });
  }
};
const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized!!");
    }
    const { medicineId } = req.params;

    const isSeller = user.role === UserRole.SELLER;

    const result = await medicineService.deleteMedicine(
      medicineId as string,

      user.id,
      isSeller,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Delete This Medicines..!!",
      details: error,
    });
  }
};

export const medicineController = {
  getAllMedicines,
  addMedicine,
  getMedicineDetails,
  updateMedicine,
  deleteMedicine,
};
