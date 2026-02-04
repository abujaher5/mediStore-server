import { title } from "node:process";
import { Medicine } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { MedicineWhereInput } from "../../../generated/prisma/models";

const addMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "sellerId">,
  sellerId: string,
) => {
  const result = await prisma.medicine.create({
    data: { ...data, sellerId: sellerId },
  });
  return result;
};

const getAllMedicines = async ({ search }: { search?: string | undefined }) => {
  const andConditions: MedicineWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }
  const allMedicine = await prisma.medicine.findMany({
    where: {
      AND: andConditions,
    },
  });
  return allMedicine;
};

const getMedicineDetails = async (medicineId: string) => {
  const medicineDetails = await prisma.medicine.findUnique({
    where: {
      id: medicineId,
    },
  });
  return medicineDetails;
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

export const medicineService = {
  getAllMedicines,
  addMedicine,
  getMedicineDetails,
  updateMedicine,
  deleteMedicine,
};
