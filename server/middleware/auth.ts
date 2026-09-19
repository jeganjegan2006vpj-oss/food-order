import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'freshcart-super-secret-key-2026-grocery';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
  iat: number;
  exp: number;
}

// Generate simple HMAC-SHA256 JWT
export function generateToken(user: { _id: string; email: string; role: 'customer' | 'admin' }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload: TokenPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${encodedPayload}`)
    .digest('base64url');
  return `${header}.${encodedPayload}.${signature}`;
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const decoded: TokenPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'customer' | 'admin';
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  const user = db.users.find(u => u._id === payload.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User does not exist.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ success: false, message: 'Account is blocked by administrator.' });
  }

  req.user = {
    userId: user._id,
    email: user.email,
    role: user.role
  };
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
    next();
  });
}
