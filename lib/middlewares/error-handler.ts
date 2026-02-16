import { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
    details: err.details || null,
  });
}


export function throwError(statusCode: number, message: string, details?: any): never {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  throw error;
}