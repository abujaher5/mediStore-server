import { prisma } from "../../lib/prisma";

interface IOrderItem {
  medicineId: string;
  name: string; // for stock error messages
  price: number;
  quantity: number;
}

interface ICreateOrder {
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    notes?: string;
  };
  items: IOrderItem[];
  paymentMethod: "COD" | "ONLINE";
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

const createOrder = async (customerId: string, payload: ICreateOrder) => {
  const user = await prisma.user.findUnique({
    where: { id: customerId },
  });

  console.log(user);

  if (!user) {
    throw new Error("User not found");
  }

  for (const item of payload.items) {
    const medicine = await prisma.medicine.findUnique({
      where: { id: item.medicineId },
    });

    if (!medicine) {
      throw new Error(`Medicine "${item.name}" not found`);
    }

    if (medicine.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${item.name}". Only ${medicine.stock} left`,
      );
    }
  }

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerId,
        status: "PENDING",
        paymentMethod: payload.paymentMethod,
        totalAmount: payload.totalAmount,
        subtotal: payload.subtotal,
        deliveryFee: payload.deliveryFee,
        customerName: payload.customer.name,
        customerPhone: payload.customer.phone,
        customerEmail: payload.customer.email ?? null,
        customerAddress: payload.customer.address,
        customerCity: payload.customer.city,
        notes: payload.customer.notes ?? null,

        items: {
          create: payload.items.map((item) => ({
            name: item.name,
            medicine: { connect: { id: item.medicineId } },
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            medicine: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    for (const item of payload.items) {
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  return order;
};

const getMyOrders = async (customerId: string) => {
  return await prisma.order.findMany({
    where: { customerId },

    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleOrder = async (orderId: string, customerId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId },
    include: {
      items: {
        include: {
          medicine: {
            select: { id: true, name: true, imageUrl: true },
          },
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const getAllOrders = async () => {
  const result = await prisma.order.findMany({
    include: {
      items: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  return result;
};

export const orderService = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
};
