import { Order } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createOrder = async (
  payload: Omit<Order, "id" | "createdAt" | "updatedAt">,
  userId: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new Error("User not found.");
  }

  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: payload.medicineId,
    },
  });

  const totalAmount = medicine.price * payload.quantity;

  const result = await prisma.order.create({
    data: {
      ...payload,
      totalAmount,
    },
  });

  return result;
};

const getAllOrders = async () => {
  const result = await prisma.order.findMany();
  return result;
};

const getMyOrders = async (customerId: string) => {
  const allOrders = await prisma.order.findMany({
    where: {
      customerId,
    },
  });
  return allOrders;
};

const getOrderDetails = async (orderId: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId,
    },
  });
  return result;
};

export const orderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderDetails,
};
