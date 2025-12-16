import sqlite3 from "sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "server/db/database.sqlite");

export function initDatabase(): sqlite3.Database {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error opening database:", err);
      process.exit(1);
    }
    console.log("Connected to SQLite database");
  });

  // Enable foreign keys
  db.run("PRAGMA foreign_keys = ON");

  // Create tables
  db.serialize(() => {
    // Admins table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'admin' CHECK(role IN ('admin', 'counselor')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Reports table
    db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_id TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('bullying', 'harassment', 'cyberbullying', 'other')),
        severity TEXT NOT NULL CHECK(severity IN ('low', 'medium', 'high')),
        description TEXT NOT NULL,
        reporter_email TEXT,
        status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_review', 'resolved')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Report updates (status changes and admin notes)
    db.run(`
      CREATE TABLE IF NOT EXISTS report_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id INTEGER NOT NULL,
        admin_id INTEGER,
        status TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id)
      )
    `);

    // Attachments table
    db.run(`
      CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better query performance
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_reports_tracking_id ON reports(tracking_id)"
    );
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status)"
    );
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at)"
    );
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_reports_severity ON reports(severity)"
    );
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_report_updates_report_id ON report_updates(report_id)"
    );
  });

  return db;
}

export function getDatabase(): sqlite3.Database {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error("Error opening database:", err);
      process.exit(1);
    }
  });
}
