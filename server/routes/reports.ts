import { Router, Request, Response } from "express";
import { Database } from "../db/database";
import {
  submitReport,
  getReportByTrackingId,
  getAllReports,
  updateReportStatus,
  getReportAnalytics,
} from "../controllers/reportsController";
import { authenticateToken, requireRole, AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export function createReportsRoutes(db: Database.Database): Router {
  const router = Router();

  // Submit anonymous report (no auth required)
  router.post("/submit", (req: Request, res: Response) => {
    try {
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

      const report = submitReport(
        db,
        category,
        severity,
        description,
        reporter_email
      );

      res.status(201).json(report);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Check report status by tracking ID (no auth required)
  router.get("/status/:tracking_id", (req: Request, res: Response) => {
    try {
      const { tracking_id } = req.params;

      if (!tracking_id) {
        throw new AppError(400, "Tracking ID is required");
      }

      const report = getReportByTrackingId(db, tracking_id);

      if (!report) {
        throw new AppError(404, "Report not found");
      }

      res.json(report);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all reports (admin/counselor only)
  router.get(
    "/",
    (req: AuthRequest, res: Response, next) =>
      authenticateToken(req, res, next),
    (req: AuthRequest, res: Response, next) =>
      requireRole(["admin", "counselor"])(req, res, next),
    (req: AuthRequest, res: Response) => {
      try {
        const { status, severity, category, limit, offset } = req.query;

        const filters: any = {};
        if (status) filters.status = status;
        if (severity) filters.severity = severity;
        if (category) filters.category = category;
        if (limit) filters.limit = parseInt(limit as string);
        if (offset) filters.offset = parseInt(offset as string);

        const result = getAllReports(db, filters);
        res.json(result);
      } catch (error) {
        if (error instanceof AppError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  );

  // Update report status (admin only)
  router.put(
    "/:id/status",
    (req: AuthRequest, res: Response, next) =>
      authenticateToken(req, res, next),
    (req: AuthRequest, res: Response, next) =>
      requireRole(["admin"])(req, res, next),
    (req: AuthRequest, res: Response) => {
      try {
        const { id } = req.params;
        const { status, notes } = req.body;

        if (!id) {
          throw new AppError(400, "Report ID is required");
        }

        if (!status) {
          throw new AppError(400, "Status is required");
        }

        const report = updateReportStatus(
          db,
          parseInt(id),
          status,
          req.admin!.id,
          notes
        );

        res.json(report);
      } catch (error) {
        if (error instanceof AppError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  );

  // Get analytics (admin only)
  router.get(
    "/analytics/summary",
    (req: AuthRequest, res: Response, next) =>
      authenticateToken(req, res, next),
    (req: AuthRequest, res: Response, next) =>
      requireRole(["admin"])(req, res, next),
    (req: AuthRequest, res: Response) => {
      try {
        const analytics = getReportAnalytics(db);
        res.json(analytics);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  return router;
}
