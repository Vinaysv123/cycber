import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  admin?: {
    id: number;
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function generateToken(
  adminId: number,
  email: string,
  role: string,
): string {
  return jwt.sign({ id: adminId, email, role }, JWT_SECRET, {
    expiresIn: "24h",
  });
}

export function verifyToken(token: string): {
  id: number;
  email: string;
  role: string;
} {
  return jwt.verify(token, JWT_SECRET) as {
    id: number;
    email: string;
    role: string;
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.admin.role)) {
      res
        .status(403)
        .json({ error: "Insufficient permissions for this action" });
      return;
    }

    next();
  };
}
