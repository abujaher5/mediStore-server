import { Medicine, Order, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const addMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "sellerId">,
  sellerId: string,
) => {
  const result = await prisma.medicine.create({
    data: { ...data, sellerId: sellerId },
  });
  return result;
};

const updateMedicine = async (
  medicineId: string,
  data: Partial<Medicine>,
  sellerId: string,
  isSeller: boolean,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });

  if (!isSeller && medicineData.sellerId !== sellerId) {
    throw new Error("You are not the owner of this medicine..!!");
  }
  const result = await prisma.medicine.update({
    where: {
      id: medicineData.id,
    },
    data,
  });

  return result;
};

const deleteMedicine = async (
  medicineId: string,
  sellerId: string,
  isSeller: boolean,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
    select: {
      id: true,
      sellerId: true,
    },
  });

  if (!isSeller && medicineData.sellerId !== sellerId) {
    throw new Error(
      "You are not the owner/creator of this Medicine to delete..",
    );
  }
  return await prisma.medicine.delete({
    where: {
      id: medicineId,
    },
  });
};

const getOrderedMedicines = async (sellerId: string) => {
  const orderedMedicines = await prisma.order.findMany({
    where: {
      medicine: {
        sellerId,
      },
    },
    include: {
      customer: true,
      medicine: true,
    },
  });
  return orderedMedicines;
};

const updateOrderStatus = async (
  orderId: string,
  sellerId: string,
  status: OrderStatus,
) => {
  await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
      medicine: {
        sellerId: sellerId,
      },
    },
  });

  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return result;
};

export const sellerServices = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getOrderedMedicines,
  updateOrderStatus,
};
