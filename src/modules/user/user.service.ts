import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User is not found..",
    });
  }
  req.user = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || "user",
    emailVerified: user.emailVerified,
  };
  next();
};

export const userService = {
  getAllUsers,
  getCurrentUser,
};
