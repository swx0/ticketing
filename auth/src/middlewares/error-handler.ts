import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

// 4 arguments for error handling middleware vs 3 arguments for normal middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.status).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: err.message }],
  });
};
