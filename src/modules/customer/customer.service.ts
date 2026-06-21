import { prisma } from "../../lib/prisma";

const getCustomerStats = async (customerId: string) => {
  // Total orders
  const totalOrders = await prisma.order.count({
    where: {
      customerId,
    },
  });

  // Pending orders
  const pendingOrders = await prisma.order.count({
    where: {
      customerId,
      status: "PENDING",
    },
  });

  // Completed orders
  const completedOrders = await prisma.order.count({
    where: {
      customerId,
      status: "DELIVERED",
    },
  });

  const shippedOrders = await prisma.order.count({
    where: {
      customerId,
      status: "SHIPPED",
    },
  });
  const confirmedOrders = await prisma.order.count({
    where: {
      customerId,
      status: "CONFIRMED",
    },
  });

  // Total spent
  const totalSpent = await prisma.order.aggregate({
    where: {
      customerId,
      status: {
        in: ["CONFIRMED", "SHIPPED", "DELIVERED"],
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  // Reviews given
  const reviewsGiven = await prisma.review.count({
    where: {
      userId: customerId,
    },
  });

  return {
    totalOrders,
    confirmedOrders,
    pendingOrders,
    completedOrders,
    shippedOrders,
    totalSpent: totalSpent._sum.totalAmount || 0,
    reviewsGiven,
  };
};
export const customerService = {
  getCustomerStats,
};
