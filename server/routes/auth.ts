import { Router, Request, Response } from "express";
import sqlite3 from "sqlite3";
import { loginAdmin, createAdminUser, verifyAdminToken } from "../controllers/authController";
import { AppError } from "../middleware/errorHandler";

export function createAuthRoutes(db: sqlite3.Database): Router {
  const router = Router();

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError(400, "Email and password are required");
      }

      const result = await loginAdmin(db, email, password);
      res.json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  router.post("/verify-token", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError(400, "Token is required");
      }

      const admin = await verifyAdminToken(token);
      res.json({ valid: true, admin });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(401).json({ error: "Invalid token" });
      }
    }
  });

  return router;
}
