import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Admin",
      email: "admin@gmail.com",
      role: UserRole.ADMIN,
      password: "admin123",
    };

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exists.!");
    }

    const result = await auth.api.signUpEmail({
      body: adminData,
    });

    await prisma.user.update({
      where: {
        email: adminData.email,
      },
      data: {
        role: adminData.role,
      },
    });

    console.log("Admin Created Successfully");
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
