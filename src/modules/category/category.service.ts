// import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (payload: any) => {
  const result = await prisma.category.create({
    data: payload,
  });
  return result;
};
const getAllCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};
const deleteCategory = async (categoryId: string, isAdmin: boolean) => {
  const categoryData = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  if (!isAdmin && categoryData.id !== categoryId) {
    throw new Error("You are not admin to delete category..");
  }
  return await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

export const categoryService = {
  createCategory,
  getAllCategories,
  deleteCategory,
};
