import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("Error:", error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof SyntaxError) {
    res.status(400).json({ error: "Invalid JSON in request body" });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
}
