import { prisma } from "../../lib/prisma";

const createOrder = async (payload: {
  customerId: string;
  medicineId: string;
  quantity: number;
  address: string;
  phone: string;
}) => {
  const medicine = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: payload.medicineId,
    },
  });

  const totalAmount = medicine.price * payload.quantity;

  const result = await prisma.order.create({
    data: {
      customerId: payload.customerId,
      address: payload.address,
      phone: payload.phone,
      totalAmount,
      items: {
        create: {
          medicineId: payload.medicineId,
          quantity: payload.quantity,
          price: medicine.price,
        },
      },
    },
  });
  return result;
};

export const orderService = {
  createOrder,
};
