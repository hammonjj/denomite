import { DB as SQLiteDB } from "sqlite";
import { readJson } from "readJson";

export class Database {
  private sqliteDB: SQLiteDB | null = null;

  constructor(private useTestDB: boolean) {
    if (useTestDB) {
      this.initializeInMemoryDB().catch((err) => {
        console.error("Failed to initialize in-memory DB:", err);
      });
    } else {
      this.initializeSqliteDB();
    }
  }

  private async initializeInMemoryDB(): Promise<void> {
    console.log("Using in-memory SQLite test database");

    try {
      this.sqliteDB = new SQLiteDB(":memory:");
      this.createTables();

      const dummyData = await readJson(`${Deno.cwd()}/src/repositories/dummyData.json`);
      this.loadDummyDataIntoDB(dummyData);

    } catch (error) {
      throw new Error(`Error initializing in-memory DB: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private initializeSqliteDB(): void {
    console.log("Using SQLite database");
    try {
      this.sqliteDB = new SQLiteDB("./database.sqlite");

      this.createTables();

    } catch (error) {
      throw new Error(`Error initializing SQLite DB: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private createTables(): void {
    if (!this.sqliteDB) {
      throw new Error("Database is not initialized.");
    }

    this.sqliteDB.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        role TEXT
      )
    `);

    this.sqliteDB.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        adminId TEXT,
        action TEXT,
        details TEXT,
        timestamp TEXT
      )
    `);

    console.log("Tables created successfully");
  }

  private loadDummyDataIntoDB(dummyData: any): void {
    if (!this.sqliteDB) {
      throw new Error("In-memory SQLite DB is not initialized.");
    }

    for (const user of dummyData.users) {
      this.sqliteDB.query(
        "INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)",
        [user.id, user.name, user.email, user.role]
      );
    }

    for (const log of dummyData.auditLogs) {
      this.sqliteDB.query(
        "INSERT INTO audit_logs (id, adminId, action, details, timestamp) VALUES (?, ?, ?, ?, ?)",
        [log.id, log.adminId, log.action, log.details, log.timestamp]
      );
    }

    console.log("Dummy data loaded into in-memory DB");
  }

  query(query: string, params: any[] = []): any {
    if (!this.sqliteDB) {
      throw new Error("SQLite DB is not initialized.");
    }
    return this.sqliteDB.query(query, params);
  }

  closeDatabase(): void {
    if (this.sqliteDB) {
      this.sqliteDB.close();
    }
  }
}