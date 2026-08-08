export class ApiError extends Error {
  public statusCode: number;
  public success: boolean;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.isOperational = isOperational;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
