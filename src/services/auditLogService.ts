import { AuditLogRepository } from "../repositories/auditLogRepository.ts";
import { AuditLogDto } from "../dto/auditLogDto.ts";

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  async logAction(action: string, details: any): Promise<AuditLogDto> {
    const logEntry: AuditLogDto = {
      id: Date.now(),
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    await this.auditLogRepository.addLog(logEntry);
    return logEntry;
  }

  async getLogs(): Promise<AuditLogDto[]> {
    return this.auditLogRepository.getLogs();
  }
}
