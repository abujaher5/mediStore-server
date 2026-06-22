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

    const result = await orderService.createOrder(customerId, req.body);

    // CASE 1 → CASH ON DELIVERY
    if (result?.type === "COD") {
      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Order placed successfully",
        data: {
          type: "COD",
          orderId: result.orderId,
        },
      });
      return;
    }

    // CASE 2 → ONLINE PAYMENT — return Stripe checkout URL to frontend
    if (result?.type === "ONLINE") {
      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Redirecting to payment gateway",
        data: {
          type: "ONLINE",
          orderId: result.orderId,
          paymentUrl: result.paymentUrl, // ✅ frontend redirects here
        },
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// ✅ NEW — called from /payment-success page after Stripe redirects back
const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Session ID is required",
      });
      return;
    }

    const result = await orderService.verifyPayment(sessionId);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Payment verified successfully",
      data: result,
    });
  } catch (error) {
    next(error);
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

    const result = await orderService.getSingleOrder(orderId, customerId);

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
  verifyPayment, // ✅ exported
  getAllOrders,
  getMyOrders,
  getOrderDetails,
};
