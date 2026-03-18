import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string;
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');

export interface JWTPayload {
  userId: number;
  username: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export const generateToken = (user: { id: number; username: string }): string => {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    email: '', // Assuming email is not available or can be empty for this token
  };
  const options: SignOptions = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (_error) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1] || null;
}
