import { Request, Response } from "express";
import { customerService } from "./customer.service";

const getCustomerStats = async (req: Request, res: Response) => {
  try {
    const customerId = req.user?.id;

    const result = await customerService.getCustomerStats(customerId as string);

    res.status(200).json({
      success: true,
      message: "Customer stats fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch customer stats",
      error,
    });
  }
};

export const customerController = {
  getCustomerStats,
};
