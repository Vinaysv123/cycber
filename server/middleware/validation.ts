import { Request, Response, NextFunction } from "express";
import { AppError } from "./errorHandler";

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 10000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && password.length <= 255;
}

export function validateReportInput(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const { category, severity, description, reporter_email } = req.body;

  const validCategories = ["bullying", "harassment", "cyberbullying", "other"];
  const validSeverities = ["low", "medium", "high"];

  if (!validCategories.includes(category)) {
    throw new AppError(400, "Invalid category");
  }

  if (!validSeverities.includes(severity)) {
    throw new AppError(400, "Invalid severity level");
  }

  if (!description || description.trim().length === 0) {
    throw new AppError(400, "Description is required");
  }

  if (description.length > 5000) {
    throw new AppError(400, "Description is too long");
  }

  if (reporter_email && !validateEmail(reporter_email)) {
    throw new AppError(400, "Invalid email format");
  }

  next();
}
