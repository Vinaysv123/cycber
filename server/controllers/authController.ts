import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../middleware/auth";
import { runQuery, getQuery } from "../db/utils";
import { AppError } from "../middleware/errorHandler";
import { validateEmail, validatePassword } from "../middleware/validation";

interface Admin {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function loginAdmin(
  db: Database.Database,
  email: string,
  password: string
): { token: string; admin: Admin } {
  if (!validateEmail(email)) {
    throw new AppError(400, "Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new AppError(400, "Invalid password");
  }

  const admin = getQuery<any>(
    db,
    "SELECT * FROM admins WHERE email = ?",
    [email]
  );

  if (!admin) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatch = bcrypt.compareSync(password, admin.password_hash);

  if (!passwordMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken(admin.id, admin.email, admin.role);

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

export function createAdminUser(
  db: Database.Database,
  email: string,
  password: string,
  name: string,
  role: "admin" | "counselor" = "admin"
): Admin {
  if (!validateEmail(email)) {
    throw new AppError(400, "Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new AppError(400, "Password must be at least 8 characters");
  }

  if (!name || name.trim().length === 0) {
    throw new AppError(400, "Name is required");
  }

  const existingAdmin = getQuery<any>(
    db,
    "SELECT id FROM admins WHERE email = ?",
    [email]
  );

  if (existingAdmin) {
    throw new AppError(400, "Email already in use");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  runQuery(
    db,
    `INSERT INTO admins (email, password_hash, name, role)
     VALUES (?, ?, ?, ?)`,
    [email, hashedPassword, name, role]
  );

  const newAdmin = getQuery<Admin>(
    db,
    "SELECT id, email, name, role FROM admins WHERE email = ?",
    [email]
  );

  if (!newAdmin) {
    throw new AppError(500, "Failed to create admin user");
  }

  return newAdmin;
}

export function verifyAdminToken(token: string): {
  id: number;
  email: string;
  role: string;
} {
  try {
    return verifyToken(token);
  } catch (error) {
    throw new AppError(401, "Invalid or expired token");
  }
}
