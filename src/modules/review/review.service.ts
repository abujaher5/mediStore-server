import { prisma } from "../../lib/prisma";

const createReview = async (
  userId: string,
  payload: { quote: string; designation: string },
) => {
  const result = await prisma.review.create({
    data: {
      quote: payload.quote,
      designation: payload.designation,
      userId,
    },
  });

  return result;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const result = reviews.map((review) => ({
    id: review.id,
    quote: review.quote,
    name: review.user.name,
    designation: review.designation,
    src:
      review.user.image ||
      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        review.user.name || "User",
      )}`,
  }));

  return result;
};

export const reviewService = {
  createReview,
  getAllReviews,
};
