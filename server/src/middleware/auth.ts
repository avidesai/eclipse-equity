// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import environment from '../config/environment';
import { RequestHandler } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Declare global namespace to extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, environment.JWT_SECRET!) as UserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;