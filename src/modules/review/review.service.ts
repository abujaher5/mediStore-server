import { prisma } from "../../lib/prisma";

const createReview = async (
  userId: string,
  payload: { quote: string; designation: string; rating: number },
) => {
  const rating = Math.min(5, Math.max(1, Math.round(payload.rating) || 5));

  const result = await prisma.review.create({
    data: {
      quote: payload.quote.trim(),
      designation: payload.designation.trim(),
      rating,
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
    rating: review.rating,
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
