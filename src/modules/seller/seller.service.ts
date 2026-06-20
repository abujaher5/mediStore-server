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
const getMyMedicines = async (sellerId: string) => {
  const result = await prisma.medicine.findMany({
    where: {
      sellerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSellerStats = async (sellerId: string) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId,
    },
  });

  const orderedMedicines = await prisma.order.findMany({
    where: {
      items: {
        some: {
          medicine: {
            sellerId: sellerId,
          },
        },
      },
    },
  });

  const totalMedicines = medicines.length;

  const totalStock = medicines.reduce((acc, medicine) => {
    return acc + medicine.stock;
  }, 0);

  const lowStock = medicines.filter(
    (medicine) => medicine.stock > 0 && medicine.stock < 10,
  ).length;

  const outOfStock = medicines.filter(
    (medicine) => medicine.stock === 0,
  ).length;

  const totalOrders = orderedMedicines.length;

  const revenue = await prisma.orderItem.aggregate({
    where: {
      medicine: {
        sellerId: sellerId,
      },
    },

    _sum: {
      subtotal: true,
    },
  });

  const totalRevenue = revenue._sum.subtotal || 0;
  return {
    totalMedicines,
    totalStock,
    lowStock,
    outOfStock,
    totalOrders,
    totalRevenue,
  };
};

const updateMedicine = async (
  medicineId: string,
  name: string,
  price: number,
  stock: number,
  manufacturer: string,
  sellerId: string,
  isSeller: boolean,
) => {
  const medicineData = await prisma.medicine.findUniqueOrThrow({
    where: {
      id: medicineId,
    },
  });

  if (isSeller && medicineData.sellerId !== sellerId) {
    throw new Error("You are not the owner");
  }
  console.log(medicineData.id);

  const result = await prisma.medicine.update({
    where: {
      id: medicineId,
    },
    data: { name, price, stock, manufacturer },
  });
  console.log("updated data", result);

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
      items: {
        some: {
          medicine: {
            sellerId: sellerId,
          },
        },
      },
    },

    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      items: {
        where: {
          medicine: {
            sellerId: sellerId, // only this seller's medicines
          },
        },

        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
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
      items: {
        some: {
          medicine: {
            sellerId: sellerId,
          },
        },
      },
    },
  });

  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  return result;
};

const updateStock = async (
  medicineId: string,
  sellerId: string,
  quantity: number,
) => {
  await prisma.medicine.findFirstOrThrow({
    where: {
      id: medicineId,
      sellerId: sellerId,
    },
  });

  return await prisma.medicine.update({
    where: {
      id: medicineId,
    },
    data: {
      stock: {
        increment: quantity,
      },
    },
  });
};
export const sellerServices = {
  addMedicine,
  getMyMedicines,
  updateMedicine,
  deleteMedicine,
  getOrderedMedicines,
  updateOrderStatus,
  updateStock,
  getSellerStats,
};
