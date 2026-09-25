import { Request, Response, NextFunction } from "express";
import { medicineService } from "./medicine.service";
import { UserRole } from "../../middlewares/auth";
import { ApiError } from "../../errorHelpers/ApiError";

const addMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new ApiError(401, "Unauthorized!");
    }
    const result = await medicineService.addMedicine(
      req.body,
      sellerId as string,
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getAllMedicines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search, categoryId, page, limit } = req.query;

    const searchString = typeof search === "string" ? search : undefined;
    const categoryIdString =
      typeof categoryId === "string" ? categoryId : undefined;

    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 9;

    const result = await medicineService.getAllMedicines({
      search: searchString,
      categoryId: categoryIdString,
      page: pageNumber,
      limit: limitNumber,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicineDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { medicineId } = req.params;

    if (!medicineId) {
      throw new ApiError(400, "Medicine id is required!!");
    }
    const result = await medicineService.getMedicineDetails(
      medicineId as string,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "You are unauthorized..!!");
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
    next(error);
  }
};

const deleteMedicine = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "You are unauthorized!!");
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
    next(error);
  }
};

export const medicineController = {
  getAllMedicines,
  addMedicine,
  getMedicineDetails,
  updateMedicine,
  deleteMedicine,
};
