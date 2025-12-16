import { getDatabase, Database } from "./database";

export function initDatabase(): Database {
  console.log("Initializing database...");
  const db = getDatabase();
  console.log("Database initialized successfully");
  return db;
}
