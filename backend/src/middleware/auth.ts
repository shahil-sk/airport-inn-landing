import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { formatResponse } from '../utils/helpers';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role?: 'user' | 'admin';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        formatResponse(false, undefined, undefined, 'No token provided')
      );
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, secret) as any;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
      next();
    } catch (error) {
      return res.status(401).json(
        formatResponse(false, undefined, undefined, 'Invalid or expired token')
      );
    }
  } catch (error) {
    return res.status(401).json(
      formatResponse(false, undefined, undefined, 'Authentication failed')
    );
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json(
      formatResponse(false, undefined, undefined, 'Admin access required')
    );
  }
  next();
};

