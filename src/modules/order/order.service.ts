import { prisma } from "../../lib/prisma";
import Stripe from "stripe";

interface IOrderItem {
  medicineId: string;
  name: string;
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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const createOrder = async (customerId: string, payload: ICreateOrder) => {
  // 1. Check user
  const user = await prisma.user.findUnique({
    where: { id: customerId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // 2. Check stock availability
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

  /*
    CASE 1 → CASH ON DELIVERY
  */

  if (payload.paymentMethod === "COD") {
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId,

          status: "PENDING",

          paymentMethod: "COD",

          paymentStatus: "PENDING",

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
              medicine: {
                connect: {
                  id: item.medicineId,
                },
              },
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
          },
        },
      });

      // Reduce stock immediately for COD
      for (const item of payload.items) {
        await tx.medicine.update({
          where: {
            id: item.medicineId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return {
      type: "COD",
      orderId: order.id,
    };
  }

  /*
    CASE 2 → STRIPE PAYMENT
  */

  if (payload.paymentMethod === "ONLINE") {
    // Create order first
    const order = await prisma.order.create({
      data: {
        customerId,

        status: "PENDING",

        paymentMethod: "ONLINE",

        paymentStatus: "PENDING",

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
            medicine: {
              connect: {
                id: item.medicineId,
              },
            },
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    });

    // Create Stripe session
    const BDT_TO_USD_RATE = 0.0091;
    const amountInUsd = parseFloat(
      (payload.totalAmount * BDT_TO_USD_RATE).toFixed(2),
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",

            product_data: {
              name: "MediStore Order",
              description: `৳${payload.totalAmount} BDT — Delivery to ${payload.customer.city}`,
            },

            unit_amount: Math.round(amountInUsd * 100),
          },

          quantity: 1,
        },
      ],

      success_url: `${process.env.APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.APP_URL}/payment-cancel`,
    });

    // Save stripe session id
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        stripeSessionId: session.id,
      },
    });

    return {
      type: "ONLINE",
      orderId: order.id,
      paymentUrl: session.url,
    };
  }
};
const verifyPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    throw new Error("Payment failed");
  }

  const order = await prisma.order.findFirst({
    where: {
      stripeSessionId: sessionId,
    },

    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Update order
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: {
        id: order.id,
      },

      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    });

    // NOW reduce stock
    for (const item of order.items) {
      await tx.medicine.update({
        where: {
          id: item.medicineId,
        },

        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
  });

  return {
    success: true,
  };
};

// const createOrder = async (customerId: string, payload: ICreateOrder) => {
//   const user = await prisma.user.findUnique({
//     where: { id: customerId },
//   });

//   console.log(user);

//   if (!user) {
//     throw new Error("User not found");
//   }

//   for (const item of payload.items) {
//     const medicine = await prisma.medicine.findUnique({
//       where: { id: item.medicineId },
//     });

//     if (!medicine) {
//       throw new Error(`Medicine "${item.name}" not found`);
//     }

//     if (medicine.stock < item.quantity) {
//       throw new Error(
//         `Insufficient stock for "${item.name}". Only ${medicine.stock} left`,
//       );
//     }
//   }

//   const order = await prisma.$transaction(async (tx) => {
//     const newOrder = await tx.order.create({
//       data: {
//         customerId,
//         status: "PENDING",
//         paymentMethod: payload.paymentMethod,
//         totalAmount: payload.totalAmount,
//         subtotal: payload.subtotal,
//         deliveryFee: payload.deliveryFee,
//         customerName: payload.customer.name,
//         customerPhone: payload.customer.phone,
//         customerEmail: payload.customer.email ?? null,
//         customerAddress: payload.customer.address,
//         customerCity: payload.customer.city,
//         notes: payload.customer.notes ?? null,

//         items: {
//           create: payload.items.map((item) => ({
//             name: item.name,
//             medicine: { connect: { id: item.medicineId } },
//             quantity: item.quantity,
//             price: item.price,
//             subtotal: item.price * item.quantity,
//           })),
//         },
//       },
//       include: {
//         items: {
//           include: {
//             medicine: {
//               select: { id: true, name: true },
//             },
//           },
//         },
//       },
//     });

//     for (const item of payload.items) {
//       await tx.medicine.update({
//         where: { id: item.medicineId },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }

//     return newOrder;
//   });

//   return order;
// };

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
  verifyPayment,
};
