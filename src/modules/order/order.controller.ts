import { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await orderService.createOrder(
      req.body,
      req.user?.id as string,
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Order can't created..!!!",
      details: error,
    });
  }
};
const getAllOrders = async (req: Request, res: Response) => {
  try {
    console.log(req.user);
    const result = await orderService.getAllOrders();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all the orders",
      details: error,
    });
  }
};

const getMyOrders = async (req: Request, res: Response) => {
  const customerId = req.user?.id;
  try {
    const result = await orderService.getMyOrders(customerId as string);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get your  orders",
      details: error,
    });
  }
};

const getOrderDetails = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await orderService.getOrderDetails(orderId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot Get Order Details..",
      details: error,
    });
  }
};

export const orderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderDetails,
};
