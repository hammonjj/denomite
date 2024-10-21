import { DB as SQLiteDB } from "sqlite";
import { readJson } from "readJson";

export class Database {
  // deno-lint-ignore no-explicit-any
  private inMemoryDB: any = {};
  private sqliteDB: SQLiteDB | null = null;

  constructor(private useTestDB: boolean) {
    if (useTestDB) {
      this.loadDummyData().catch((err) => {
        console.error("Failed to load dummy data:", err);
      });
    } else {
      this.loadSqliteData();
    }
  }

  private async loadDummyData(): Promise<void> {
    console.log("Using in-memory test database");
    try {
       //this.sqliteDB = new SQLiteDB(":memory:");
      const dummyData = await readJson("./dummyData.json");
      this.inMemoryDB = dummyData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error loading dummy data: ${error.message}`);
      } else {
        throw new Error("Error loading dummy data: Unknown error");
      }
    }
  }

  private loadSqliteData(): void {
    console.log("Using SQLite database");
    try {
      this.sqliteDB = new SQLiteDB("./database.sqlite");
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error initializing SQLite DB: ${error.message}`);
      } else {
        throw new Error("Error initializing SQLite DB: Unknown error");
      }
    }
  }

  getDatabase() {
    return this.useTestDB ? this.inMemoryDB : this.sqliteDB;
  }

  query(query: string, params: any[] = []) {
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
