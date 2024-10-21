import { Database } from "./database.ts"; // Import the Database class

export class AuditLogRepository {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async getLogs() {
    return this.db.query("SELECT * FROM audit_logs");
  }

  async addLog(logData: any) {
    return this.db.query("INSERT INTO audit_logs (id, action, details, timestamp) VALUES (?, ?, ?, ?)", 
      [logData.id, logData.action, logData.details, logData.timestamp]);
  }
}
