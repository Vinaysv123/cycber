import Database from "better-sqlite3";

export function runQuery(
  db: Database.Database,
  sql: string,
  params: any[] = []
): void {
  const stmt = db.prepare(sql);
  stmt.run(...params);
}

export function getQuery<T>(
  db: Database.Database,
  sql: string,
  params: any[] = []
): T | undefined {
  const stmt = db.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function allQuery<T>(
  db: Database.Database,
  sql: string,
  params: any[] = []
): T[] {
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
}
