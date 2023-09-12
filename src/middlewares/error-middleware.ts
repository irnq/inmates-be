import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/api-error';

export function errorMiddleware(error: ApiError | Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message, errors: error.errors });
  }
  return res.status(500).json({ message: 'Unexpected error. Something went wrong :(', errors: [error.message] });
}
