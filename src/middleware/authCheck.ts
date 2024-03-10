import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(createHttpError(403));
  }
  next();
};

export default authCheck;
