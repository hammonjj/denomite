import { SSQL } from "smallormSqlite";
import { AuditLogModel } from "../models/auditLogModel.ts";
import { AuditLogDto } from "../dto/auditLogDto.ts";
import type { Database } from './database.ts';
import type { CreateAuditLogDto } from '../dto/createAuditLogDto.ts';

export class AuditLogRepository {
  private orm: SSQL;

  constructor(db: Database) {
    this.orm = db.getORM();
  }

  getLogs(): AuditLogDto[] {
    const logs = this.orm.findMany(AuditLogModel, {});
    return logs.map(log => ({
      id: log.id,
      userId: log.userId,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
    }));
  }

  addLog(logData: CreateAuditLogDto): AuditLogDto {
    const log = new AuditLogModel();
    log.userId = logData.userId;
    log.action = logData.action;
    log.details = logData.details;
    log.timestamp = logData.timestamp;
    this.orm.save(log);

    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
    };
  }
}