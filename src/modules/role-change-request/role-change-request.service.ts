import { prisma } from "../../lib/prisma";
import { ApiError } from "../../errorHelpers/ApiError";
import { UserRole } from "../../middlewares/auth";
import { RequestStatus } from "../../generated/prisma/enums";
import { Prisma } from "../../generated/prisma/client";

const ROLE_UPGRADE_PATH: Record<string, string> = {
  [UserRole.CUSTOMER]: UserRole.SELLER,
  [UserRole.SELLER]: UserRole.ADMIN,
};

const createRoleChangeRequest = async (
  userId: string,
  payload: { requestedRole?: string; reason?: string },
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const currentRole = user.role ?? UserRole.CUSTOMER;
  const allowedRole = ROLE_UPGRADE_PATH[currentRole];

  if (!allowedRole) {
    throw new ApiError(
      400,
      "Your current role is not allowed to request a role change",
    );
  }

  if (payload.requestedRole && payload.requestedRole !== allowedRole) {
    throw new ApiError(
      400,
      `As a ${currentRole} you can only request to become a ${allowedRole}`,
    );
  }

  const existingPendingRequest = await prisma.roleChangeRequest.findFirst({
    where: { userId, status: RequestStatus.PENDING },
  });

  if (existingPendingRequest) {
    throw new ApiError(
      400,
      "You already have a pending role change request. Please wait for the admin's decision",
    );
  }

  const result = await prisma.roleChangeRequest.create({
    data: {
      userId,
      currentRole,
      requestedRole: allowedRole,
      reason: payload.reason ?? null,
    },
  });

  return result;
};

const getMyRequests = async (userId: string) => {
  const result = await prisma.roleChangeRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

const getAllRequests = async (status: RequestStatus | "ALL" | undefined) => {
  const where: Prisma.RoleChangeRequestWhereInput =
    status && status !== "ALL" ? { status } : {};

  const result = await prisma.roleChangeRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        },
      },
    },
  });

  return result;
};

const VALID_ROLES = [UserRole.CUSTOMER, UserRole.SELLER, UserRole.ADMIN];

const updateRequestRole = async (requestId: string, newRole: string) => {
  const requestData = await prisma.roleChangeRequest.findUnique({
    where: { id: requestId },
    include: {
      user: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });

  if (!requestData) {
    throw new ApiError(404, "Role change request not found");
  }

  if (requestData.status !== RequestStatus.PENDING) {
    throw new ApiError(400, "Only pending requests can be modified");
  }

  if (!VALID_ROLES.includes(newRole as UserRole)) {
    throw new ApiError(
      400,
      `Invalid role. Valid roles are: ${VALID_ROLES.join(", ")}`,
    );
  }

  const userCurrentRole = requestData.user?.role ?? UserRole.CUSTOMER;

  if (newRole === userCurrentRole) {
    throw new ApiError(400, `The user already has the ${userCurrentRole} role`);
  }

  if (newRole === requestData.requestedRole) {
    throw new ApiError(
      400,
      `The requested role is already ${requestData.requestedRole}`,
    );
  }

  const result = await prisma.roleChangeRequest.update({
    where: { id: requestId },
    data: { requestedRole: newRole },
  });

  return result;
};

const approveRequest = async (requestId: string) => {
  const requestData = await prisma.roleChangeRequest.findUnique({
    where: { id: requestId },
  });

  if (!requestData) {
    throw new ApiError(404, "Role change request not found");
  }

  if (requestData.status !== RequestStatus.PENDING) {
    throw new ApiError(400, "This request has already been processed");
  }

  await prisma.$transaction([
    prisma.roleChangeRequest.update({
      where: { id: requestId },
      data: { status: RequestStatus.APPROVED },
    }),
    prisma.user.update({
      where: { id: requestData.userId },
      data: { role: requestData.requestedRole },
    }),
  ]);

  return { requestId, newRole: requestData.requestedRole };
};

const rejectRequest = async (requestId: string) => {
  const requestData = await prisma.roleChangeRequest.findUnique({
    where: { id: requestId },
  });

  if (!requestData) {
    throw new ApiError(404, "Role change request not found");
  }

  if (requestData.status !== RequestStatus.PENDING) {
    throw new ApiError(400, "This request has already been processed");
  }

  await prisma.roleChangeRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.REJECTED },
  });

  return { requestId };
};

export const roleChangeRequestService = {
  createRoleChangeRequest,
  getMyRequests,
  getAllRequests,
  updateRequestRole,
  approveRequest,
  rejectRequest,
};
