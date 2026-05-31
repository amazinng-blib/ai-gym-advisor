import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
import * as jwt from 'jsonwebtoken';

// Extend Express Request to include user data
export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

/**
 * Authentication Middleware
 * Verifies JWT token and extracts user ID from request
 * Follows senior dev pattern: fail fast, clear error messages
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Access token required',
      };
      return res.status(401).json(response);
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    jwt.verify(token, secret, (err: any, user: any) => {
      if (err) {
        console.error('Token verification failed:', err.message);
        const response: ApiResponse<null> = {
          success: false,
          message: 'Invalid or expired token',
        };
        return res.status(403).json(response);
      }
      req.userId = user.userId;
      req.user = user;
      next();
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Authentication failed';
    const response: ApiResponse<null> = {
      success: false,
      message: 'Authentication error',
      error: errorMessage,
    };
    res.status(500).json(response);
  }
};

/**
 * Optional Auth Middleware
 * Attaches user data if token exists, but allows request to proceed without it
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      jwt.verify(token, secret, (err: any, user: any) => {
        if (!err) {
          req.userId = user.id;
          req.user = user;
        }
        next();
      });
    } else {
      next();
    }
  } catch (error) {
    // Silently fail and continue
    next();
  }
};
