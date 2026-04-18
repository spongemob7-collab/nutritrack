import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Authentication disabled for public access
  (req as any).userId = "guest";
  next();
};
