import { Request, Response, NextFunction } from "express";
import { orderService } from "./order.service";
import httpStatus from "http-status";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await orderService.createOrder(customerId, req.body); // ✅ customerId first

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Order placed successfully",
      data: { orderId: result.id },
    });
  } catch (error) {
    next(error); // ✅ pass to global error handler
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrders();

    res.status(httpStatus.OK).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Cannot get all orders..!!!",
      details: error,
    });
  }
};

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await orderService.getMyOrders(customerId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Your orders fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user?.id;

    // Validate orderId: express can type params as string | string[] | undefined
    if (!orderId || Array.isArray(orderId)) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Invalid orderId",
      });
      return;
    }

    if (!customerId) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const result = await orderService.getSingleOrder(orderId, customerId); // ✅ pass customerId for ownership check

    res.status(httpStatus.OK).json({
      success: true,
      message: "Order details fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetails,
};
