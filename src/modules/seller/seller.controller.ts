import { Request, Response } from "express";

import { UserRole } from "../../middlewares/auth";
import { sellerServices } from "./seller.service";

const addMedicine = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const user = req.user;

    if (!sellerId) {
      return res.status(400).json({
        error: "Unauthorized!",
      });
    }
    const isSeller = user?.role === UserRole.SELLER;
    if (isSeller === false) {
      res.status(400).json({
        error: "You are not seller to add medicine.",
      });
    } else {
      const result = await sellerServices.addMedicine(
        req.body,
        sellerId as string,
      );

      res.status(201).json(result);
    }
  } catch (error) {
    res.status(400).json({
      error: "Cannot add this medicines",
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
    const result = await sellerServices.updateMedicine(
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

    const result = await sellerServices.deleteMedicine(
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

const getOrderedMedicines = async (req: Request, res: Response) => {
  const sellerId = req.user?.id;
  try {
    const result = await sellerServices.getOrderedMedicines(sellerId as string);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get your  orders",
      details: error,
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const orderId = req.params.orderId;

    const { status } = req.body;

    const result = await sellerServices.updateOrderStatus(
      orderId as string,
      sellerId as string,
      status,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Update This Order Status..!!",
      details: error,
    });
  }
};
export const sellerControllers = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getOrderedMedicines,
  updateOrderStatus,
};
