import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error:', err.message);

  const response: ApiResponse<null> = {
    success: false,
    message: 'Internal server error',
    error: err.message,
  };

  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse<null> = {
    success: false,
    message: 'Route not found',
  };

  res.status(404).json(response);
};
