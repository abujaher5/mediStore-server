import { Request, Response } from "express";
import { roleChangeRequestService } from "./role-change-request.service";
import { asyncHandler } from "../../shared/asyncHandler";
import { sendResponse } from "../../shared/sendResponse";
import { RequestStatus } from "../../generated/prisma/enums";

const createRoleChangeRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { requestedRole, reason } = req.body;

    const result = await roleChangeRequestService.createRoleChangeRequest(
      userId as string,
      { requestedRole, reason },
    );

    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Role change request submitted successfully",
      data: result,
    });
  },
);

const getMyRequests = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await roleChangeRequestService.getMyRequests(
    userId as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Your role change requests get successfully",
    data: result,
  });
});

const getAllRequests = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  const result = await roleChangeRequestService.getAllRequests(
    status as RequestStatus | "ALL" | undefined,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "all role change requests get successfully",
    data: result,
  });
});

const updateRequestRole = asyncHandler(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { requestedRole } = req.body;

  const result = await roleChangeRequestService.updateRequestRole(
    requestId as string,
    requestedRole,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Requested role updated successfully",
    data: result,
  });
});

const approveRequest = asyncHandler(async (req: Request, res: Response) => {
  const { requestId } = req.params;

  const result = await roleChangeRequestService.approveRequest(
    requestId as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Role change request approved successfully",
    data: result,
  });
});

const rejectRequest = asyncHandler(async (req: Request, res: Response) => {
  const { requestId } = req.params;

  const result = await roleChangeRequestService.rejectRequest(
    requestId as string,
  );

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Role change request rejected successfully",
    data: result,
  });
});

export const roleChangeRequestController = {
  createRoleChangeRequest,
  getMyRequests,
  getAllRequests,
  updateRequestRole,
  approveRequest,
  rejectRequest,
};
