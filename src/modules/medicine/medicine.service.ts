import { Medicine } from "../../../generated/prisma/client";
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

const getAllMedicines = async () => {
  const allMedicine = await prisma.medicine.findMany();
  return allMedicine;
};

export const medicineService = {
  getAllMedicines,
  addMedicine,
};
