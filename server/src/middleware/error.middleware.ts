import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { error } from '../utils/response';
import env from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof AppError) {
    return error(res, err.message, err.statusCode);
  }

  // Handle generic / system errors
  console.error('Unexpected Server Error:', err);

  const message = env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
  return error(res, message, 500);
};
