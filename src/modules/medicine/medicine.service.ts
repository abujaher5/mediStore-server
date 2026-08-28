import { prisma } from "../../lib/prisma";
import { MedicineWhereInput } from "../../generated/prisma/models";
import { Medicine } from "../../generated/prisma/client.js";

const addMedicine = async (
  data: Omit<Medicine, "id" | "createdAt" | "updatedAt" | "sellerId">,
  sellerId: string,
) => {
  const result = await prisma.medicine.create({
    data: { ...data, sellerId: sellerId },
  });
  return result;
};

const getAllMedicines = async ({
  search,
  page,
  limit,
}: {
  search?: string | undefined;
  page?: number;
  limit?: number;
}) => {
  const currentPage = page || 1;
  const itemsPerPage = limit || 9;
  const skip = (currentPage - 1) * itemsPerPage;

  const andConditions: MedicineWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        {
          description: { contains: search, mode: "insensitive" },
        },
        {
          manufacturer: { contains: search, mode: "insensitive" },
        },
      ],
    });
  }

  const where = { AND: andConditions };

  const [allMedicine, totalItems] = await Promise.all([
    prisma.medicine.findMany({
      where,
      skip,
      take: itemsPerPage,
      orderBy: { createdAt: "desc" },
    }),
    prisma.medicine.count({ where }),
  ]);

  return {
    data: allMedicine,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      currentPage,
      itemsPerPage,
    },
  };
};

const getMedicineDetails = async (medicineId: string) => {
  const medicineDetails = await prisma.medicine.findUnique({
    where: {
      id: medicineId,
    },
    include: {
      category: true,
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
  addMedicine,
  getAllMedicines,
  getMedicineDetails,
  updateMedicine,
  deleteMedicine,
};
