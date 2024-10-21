import { Database } from "./database.ts"; // Import the Database class

export class AuditLogRepository {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async getLogs() {
    const dbInstance = this.db.getDatabase();
    return await dbInstance.collection("auditLogs").find();
  }

  async addLog(logData: any) {
    const dbInstance = this.db.getDatabase();
    return await dbInstance.collection("auditLogs").insertOne(logData);
  }
}
