import { AuditLogRepository } from "../repositories/auditLogRepository.ts";
import { AuditLogDto } from "../dto/auditLogDto.ts";
import type { AuditLogModel } from '../models/auditLogModel.ts';
import type { CreateAuditLogDto } from '../dto/createAuditLogDto.ts';

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  async logAction(action: string, details: any): Promise<AuditLogDto> {
    const logEntry: CreateAuditLogDto = {
      action,
      details,
      userId: 1, // Assume the user ID is always 1 for the moment
      timestamp: new Date().toISOString(),
    };

    return await this.auditLogRepository.addLog(logEntry);
  }

  async getLogs(): Promise<AuditLogDto[]> {
    const logs = await this.auditLogRepository.getLogs();

    return logs.map((log: AuditLogModel) => ({
      id: log.id,
      userId: log.userId,
      action: log.action,
      details: log.details,
      timestamp: log.timestamp,
    }));
  }
}
