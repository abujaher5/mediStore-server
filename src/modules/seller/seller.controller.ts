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
const getMyMedicines = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    console.log(req.user);

    if (!sellerId) {
      return res.status(401).json({
        error: "Unauthorized!",
      });
    }

    const result = await sellerServices.getMyMedicines(sellerId as string);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch medicines",
      details: error,
    });
  }
};

const getSellerStats = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await sellerServices.getSellerStats(sellerId as string);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get seller statistics",
      details: error,
    });
  }
};

const updateMedicine = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { name, price, stock, manufacturer } = req.body;
    if (!user) {
      throw new Error("You are unauthorized..!!");
    }

    const { medicineId } = req.params;
    console.log(medicineId, req.body);
    const isSeller = user.role === UserRole.SELLER;
    const result = await sellerServices.updateMedicine(
      medicineId as string,
      name,
      price,
      stock,
      manufacturer,
      user.id,
      isSeller,
    );
    console.log("From controller", result);

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

// const getOrderedMedicines = async (req: Request, res: Response) => {
//   const sellerId = req.user?.id;
//   try {
//     const result = await sellerServices.getOrderedMedicines(sellerId as string);

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(400).json({
//       error: "Cannot get your  orders",
//       details: error,
//     });
//   }
// };

const getOrderedMedicines = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const result = await sellerServices.getOrderedMedicines(sellerId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      error: "Cannot get your orders",
      details: error,
    });
  }
};
const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;
    const orderId = req.params.orderId;

    const { status } = req.body;
    console.log(orderId, status);

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
const updateStock = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const medicineId = req.params.medicineId;
    const { stock } = req.body;

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        error: "Invalid stock value",
      });
    }

    const result = await sellerServices.updateStock(
      medicineId as string,
      sellerId,
      stock,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Cannot update stock",
      details: error,
    });
  }
};
export const sellerControllers = {
  addMedicine,
  getMyMedicines,
  updateMedicine,
  deleteMedicine,
  getOrderedMedicines,
  updateOrderStatus,
  updateStock,
  getSellerStats,
};
