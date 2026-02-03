import { prisma } from "../../lib/prisma";

const getAllMedicines = async () => {
  const allMedicine = await prisma.medicine.findMany();
  return allMedicine;
};

export const medicineService = {
  getAllMedicines,
};
