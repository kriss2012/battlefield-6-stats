import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/auth';

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token.' });
    return;
  }

  req.user = decoded;
  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.token || extractTokenFromHeader(req.headers.authorization);

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}
