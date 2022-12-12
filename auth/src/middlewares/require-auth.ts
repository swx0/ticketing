import { Request, Response, NextFunction } from 'express';
import { NotAuthorisedError } from '../errors/not-authorised-error';

// The req passed into this middleware is assumed to have ran currentUser middleware before
// This means req.currentUser property should have been defined
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorisedError();
  }
  next();
};
