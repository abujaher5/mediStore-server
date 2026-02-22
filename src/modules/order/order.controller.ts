import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.customerId = user?.id;

    const result = await orderService.createOrder(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Order can't created..!!!",
      details: error,
    });
  }
};

export const orderController = {
  createOrder,
};
