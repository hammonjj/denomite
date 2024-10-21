export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: Date;
}

export const auditLogs: AuditLog[] = [];
