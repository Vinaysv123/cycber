import { Database } from "./database";

export function runQuery(db: Database, sql: string, params: any[] = []): void {
  db.run(sql, params);
}

export function getQuery<T>(
  db: Database,
  sql: string,
  params: any[] = [],
): T | undefined {
  return db.get<T>(sql, params);
}

export function allQuery<T>(
  db: Database,
  sql: string,
  params: any[] = [],
): T[] {
  return db.query<T>(sql, params);
}
