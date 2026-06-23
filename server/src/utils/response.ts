import { Response } from 'express';

export const success = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const paginated = <T>(res: Response, data: T[], total: number) => {
  return res.status(200).json({
    success: true,
    data,
    total,
  });
};

export const error = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
