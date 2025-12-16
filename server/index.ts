import "dotenv/config";
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { initDatabase } from "./db/init";
import { createAuthRoutes } from "./routes/auth";
import { createReportsRoutes } from "./routes/reports";
import { errorHandler } from "./middleware/errorHandler";

export function createServer() {
  const app = express();

  // Initialize database
  const db = initDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Secure headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API Routes
  app.use("/api/auth", createAuthRoutes(db));
  app.use("/api/reports", createReportsRoutes(db));

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}
