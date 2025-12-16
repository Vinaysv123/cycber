import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "server/db/data.json");

interface DBData {
  admins: {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    role: string;
    created_at: string;
    updated_at: string;
  }[];
  reports: {
    id: number;
    tracking_id: string;
    category: string;
    severity: string;
    description: string;
    reporter_email?: string;
    status: string;
    created_at: string;
    updated_at: string;
  }[];
  report_updates: {
    id: number;
    report_id: number;
    admin_id?: number;
    status: string;
    notes?: string;
    created_at: string;
  }[];
  attachments: {
    id: number;
    report_id: number;
    filename: string;
    mimetype: string;
    size: number;
    created_at: string;
  }[];
  _nextId: {
    admins: number;
    reports: number;
    report_updates: number;
    attachments: number;
  };
}

function getDefaultDB(): DBData {
  return {
    admins: [],
    reports: [],
    report_updates: [],
    attachments: [],
    _nextId: {
      admins: 1,
      reports: 1,
      report_updates: 1,
      attachments: 1,
    },
  };
}

let dbData: DBData | null = null;

function loadDB(): DBData {
  if (dbData) return dbData;

  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      dbData = JSON.parse(content);
    } else {
      dbData = getDefaultDB();
      saveDB(dbData);
    }
  } catch (error) {
    console.error("Error loading database:", error);
    dbData = getDefaultDB();
  }

  return dbData;
}

function saveDB(data: DBData): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving database:", error);
  }
}

export class Database {
  private data: DBData;

  constructor() {
    this.data = loadDB();
  }

  query<T>(sql: string, params: any[] = []): T[] {
    // Simple query parser for SELECT statements
    const lowerSql = sql.toLowerCase();

    if (lowerSql.includes("select count(*)")) {
      return [{ count: this.getCount(sql, params) }] as T[];
    }

    if (lowerSql.includes("select")) {
      return this.handleSelect<T>(sql, params);
    }

    if (lowerSql.includes("insert")) {
      this.handleInsert(sql, params);
    }

    if (lowerSql.includes("update")) {
      this.handleUpdate(sql, params);
    }

    return [];
  }

  get<T>(sql: string, params: any[] = []): T | undefined {
    const results = this.query<T>(sql, params);
    return results[0];
  }

  run(sql: string, params: any[] = []): void {
    if (sql.toLowerCase().includes("insert")) {
      this.handleInsert(sql, params);
    } else if (sql.toLowerCase().includes("update")) {
      this.handleUpdate(sql, params);
    } else if (sql.toLowerCase().includes("create table")) {
      // Ignore CREATE TABLE
    } else if (sql.toLowerCase().includes("create index")) {
      // Ignore CREATE INDEX
    } else if (sql.toLowerCase().includes("pragma")) {
      // Ignore PRAGMA
    }
  }

  private handleSelect<T>(sql: string, params: any[]): T[] {
    const lowerSql = sql.toLowerCase();

    if (lowerSql.includes("from admins")) {
      return this.filterTable(
        this.data.admins,
        sql,
        params,
        "admins"
      ) as T[];
    }

    if (lowerSql.includes("from reports")) {
      return this.filterTable(
        this.data.reports,
        sql,
        params,
        "reports"
      ) as T[];
    }

    if (lowerSql.includes("from report_updates")) {
      return this.filterTable(
        this.data.report_updates,
        sql,
        params,
        "report_updates"
      ) as T[];
    }

    return [];
  }

  private handleInsert(sql: string, params: any[]): void {
    if (sql.includes("INTO admins")) {
      const admin = {
        id: this.data._nextId.admins++,
        email: params[0],
        password_hash: params[1],
        name: params[2],
        role: params[3] || "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.data.admins.push(admin);
    } else if (sql.includes("INTO reports")) {
      const report = {
        id: this.data._nextId.reports++,
        tracking_id: params[0],
        category: params[1],
        severity: params[2],
        description: params[3],
        reporter_email: params[4] || undefined,
        status: params[5] || "pending",
        created_at: params[6],
        updated_at: params[7],
      };
      this.data.reports.push(report);
    } else if (sql.includes("INTO report_updates")) {
      const update = {
        id: this.data._nextId.report_updates++,
        report_id: params[0],
        admin_id: params[1],
        status: params[2],
        notes: params[3],
        created_at: params[4],
      };
      this.data.report_updates.push(update);
    }

    saveDB(this.data);
  }

  private handleUpdate(sql: string, params: any[]): void {
    if (sql.includes("UPDATE reports")) {
      const report = this.data.reports.find((r) => r.id === params[2]);
      if (report) {
        report.status = params[0];
        report.updated_at = params[1];
      }
    }

    saveDB(this.data);
  }

  private filterTable<T extends Record<string, any>>(
    table: T[],
    sql: string,
    params: any[],
    tableName: string
  ): T[] {
    let results = [...table];

    // Handle WHERE clauses
    if (sql.includes("WHERE")) {
      const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
      if (whereMatch) {
        const whereClause = whereMatch[1];

        if (whereClause.includes("email = ?")) {
          results = results.filter((r) => r.email === params[0]);
        }

        if (whereClause.includes("tracking_id = ?")) {
          results = results.filter((r) => r.tracking_id === params[0]);
        }

        if (whereClause.includes("id = ?")) {
          results = results.filter((r) => r.id === params[0]);
        }

        if (whereClause.includes("status = ?") && !whereClause.includes("severity")) {
          results = results.filter((r) => r.status === params[0]);
        } else if (whereClause.includes("status = ?")) {
          // Multiple conditions
          let paramIndex = 0;

          if (whereClause.includes("severity = ?")) {
            // Assume status is first
            results = results.filter((r) => r.status === params[paramIndex]);
            paramIndex++;
          }

          if (whereClause.includes("severity = ?")) {
            results = results.filter((r) => r.severity === params[paramIndex]);
          }
        }

        if (whereClause.includes("report_id = ?")) {
          results = results.filter((r) => r.report_id === params[0]);
        }
      }
    }

    // Handle GROUP BY (simple aggregation)
    if (sql.includes("GROUP BY")) {
      const groupMatch = sql.match(/GROUP BY\s+(\w+)/i);
      if (groupMatch) {
        const field = groupMatch[1];
        const grouped: Record<string, any> = {};

        results.forEach((row) => {
          const key = row[field];
          if (!grouped[key]) {
            grouped[key] = { [field]: key, count: 0 };
          }
          grouped[key].count++;
        });

        results = Object.values(grouped) as T[];
      }
    }

    // Handle ORDER BY
    if (sql.includes("ORDER BY")) {
      const orderMatch = sql.match(/ORDER BY\s+(\w+)\s+(DESC|ASC)?/i);
      if (orderMatch) {
        const field = orderMatch[1];
        const dir = orderMatch[2]?.toLowerCase() === "asc" ? 1 : -1;

        results.sort((a, b) => {
          if (a[field] < b[field]) return -dir;
          if (a[field] > b[field]) return dir;
          return 0;
        });
      }
    }

    // Handle LIMIT and OFFSET
    if (sql.includes("LIMIT")) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?/i);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1]);
        const offset = limitMatch[2] ? parseInt(limitMatch[2]) : 0;
        results = results.slice(offset, offset + limit);
      }
    }

    return results;
  }

  private getCount(sql: string, params: any[]): number {
    let table: any[] = [];

    if (sql.includes("FROM admins")) {
      table = this.data.admins;
    } else if (sql.includes("FROM reports")) {
      table = this.data.reports;
    } else if (sql.includes("FROM report_updates")) {
      table = this.data.report_updates;
    }

    // Handle simple WHERE clauses
    if (sql.includes("WHERE")) {
      if (sql.includes("email = ?")) {
        table = table.filter((r) => r.email === params[0]);
      }
      if (sql.includes("status = ?")) {
        table = table.filter((r) => r.status === params[0]);
      }
      if (sql.includes("severity = ?")) {
        table = table.filter((r) => r.severity === params[0]);
      }
      if (sql.includes("category = ?")) {
        table = table.filter((r) => r.category === params[0]);
      }
    }

    return table.length;
  }
}

let instance: Database | null = null;

export function getDatabase(): Database {
  if (!instance) {
    instance = new Database();
  }
  return instance;
}
