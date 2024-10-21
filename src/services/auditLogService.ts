import { AuditLogRepository } from "../repositories/auditLogRepository.ts";

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository) {
    this.auditLogRepository = auditLogRepository;
  }

  async logAction(action: string, details: any) {
    const logEntry = {
      action,
      details,
      timestamp: new Date(),
    };
    return this.auditLogRepository.addLog(logEntry);
  }

  async getLogs() {
    return this.auditLogRepository.getLogs();
  }
}
