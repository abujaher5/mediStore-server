import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal server error";
  let errorDetails = err;

  // For PrismaClientValidationError
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provided incorrect field key or  missing fields .!";
  }
  // For PrismaClientKnownRequestError
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Duplicate key error";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed.";
    }
  }
  // For PrismaClientUnknownRequestError
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occurred during query execution.";
  }
  // For PrismaClientInitializationError
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed.Please check your credential !!";
    } else if (err.errorCode === "P1001") {
      statusCode = 400;
      errorMessage = "Can't reach database server.";
    }
  }
  // For PrismaClientRustPanicError
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage =
      "Underlying engine crashes and exits with a non-zero exit code";
  } else if (err instanceof Error) {
    statusCode = 400;
    errorMessage = err.message;
  } else {
    console.error(err);
  }

  //   res.status(statusCode);
  //   res.json({
  //     message: errorMessage,
  //     error: errorDetails,
  //   });

  return res.status(statusCode).json({
    success: false,
    message: errorMessage,
    //   ...(process.env.NODE_ENV === "development" && {
    //   stack: err.stack,
    // }),
  });
}

export default globalErrorHandler;
