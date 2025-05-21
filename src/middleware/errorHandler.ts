import { Request, Response, NextFunction } from 'express';
import { logToFile } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof AppError) {
    logToFile('errorHandler', `Operational Error: ${err.message}`, err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      status: err.status
    });
  }

  // Programming or other unknown error
  logToFile('errorHandler', 'Unexpected Error', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
    status: 'error'
  });
}; 