import { Database } from "../db/database";
import { runQuery, getQuery, allQuery } from "../db/utils";
import { AppError } from "../middleware/errorHandler";
import crypto from "crypto";

interface Report {
  id: number;
  tracking_id: string;
  category: string;
  severity: string;
  description: string;
  reporter_email?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function generateTrackingId(): string {
  return "CG" + crypto.randomBytes(8).toString("hex").toUpperCase();
}

export function submitReport(
  db: Database.Database,
  category: string,
  severity: string,
  description: string,
  reporter_email?: string
): Report {
  const tracking_id = generateTrackingId();
  const now = new Date().toISOString();

  runQuery(
    db,
    `INSERT INTO reports (tracking_id, category, severity, description, reporter_email, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [tracking_id, category, severity, description, reporter_email || null, now, now]
  );

  const report = getQuery<Report>(
    db,
    "SELECT * FROM reports WHERE tracking_id = ?",
    [tracking_id]
  );

  if (!report) {
    throw new AppError(500, "Failed to create report");
  }

  return report;
}

export function getReportByTrackingId(
  db: Database.Database,
  tracking_id: string
): Report | null {
  const report = getQuery<Report>(
    db,
    "SELECT * FROM reports WHERE tracking_id = ?",
    [tracking_id]
  );

  return report || null;
}

export function getAllReports(
  db: Database.Database,
  filters?: {
    status?: string;
    severity?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }
): { reports: Report[]; total: number } {
  let query = "SELECT * FROM reports WHERE 1=1";
  const params: any[] = [];

  if (filters?.status) {
    query += " AND status = ?";
    params.push(filters.status);
  }

  if (filters?.severity) {
    query += " AND severity = ?";
    params.push(filters.severity);
  }

  if (filters?.category) {
    query += " AND category = ?";
    params.push(filters.category);
  }

  query += " ORDER BY created_at DESC";

  const limit = filters?.limit || 50;
  const offset = filters?.offset || 0;

  query += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const reports = allQuery<Report>(db, query, params);

  // Get total count
  let countQuery = "SELECT COUNT(*) as count FROM reports WHERE 1=1";
  const countParams: any[] = [];

  if (filters?.status) {
    countQuery += " AND status = ?";
    countParams.push(filters.status);
  }

  if (filters?.severity) {
    countQuery += " AND severity = ?";
    countParams.push(filters.severity);
  }

  if (filters?.category) {
    countQuery += " AND category = ?";
    countParams.push(filters.category);
  }

  const countResult = getQuery<{ count: number }>(
    db,
    countQuery,
    countParams
  );

  return {
    reports,
    total: countResult?.count || 0,
  };
}

export function updateReportStatus(
  db: Database.Database,
  reportId: number,
  newStatus: string,
  adminId: number,
  notes?: string
): Report {
  const validStatuses = ["pending", "in_review", "resolved"];

  if (!validStatuses.includes(newStatus)) {
    throw new AppError(400, "Invalid status");
  }

  const now = new Date().toISOString();

  runQuery(
    db,
    "UPDATE reports SET status = ?, updated_at = ? WHERE id = ?",
    [newStatus, now, reportId]
  );

  // Create a report update record
  runQuery(
    db,
    `INSERT INTO report_updates (report_id, admin_id, status, notes, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    [reportId, adminId, newStatus, notes || null, now]
  );

  const updatedReport = getQuery<Report>(
    db,
    "SELECT * FROM reports WHERE id = ?",
    [reportId]
  );

  if (!updatedReport) {
    throw new AppError(500, "Failed to update report");
  }

  return updatedReport;
}

export function getReportAnalytics(
  db: Database.Database
): {
  totalReports: number;
  severityDistribution: { severity: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
} {
  const totalResult = getQuery<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM reports"
  );

  const severityDist = allQuery<{ severity: string; count: number }>(
    db,
    `SELECT severity, COUNT(*) as count FROM reports
     GROUP BY severity
     ORDER BY count DESC`
  );

  const statusDist = allQuery<{ status: string; count: number }>(
    db,
    `SELECT status, COUNT(*) as count FROM reports
     GROUP BY status
     ORDER BY count DESC`
  );

  const categoryDist = allQuery<{ category: string; count: number }>(
    db,
    `SELECT category, COUNT(*) as count FROM reports
     GROUP BY category
     ORDER BY count DESC`
  );

  return {
    totalReports: totalResult?.count || 0,
    severityDistribution: severityDist,
    statusDistribution: statusDist,
    categoryDistribution: categoryDist,
  };
}
