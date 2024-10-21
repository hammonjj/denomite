export interface AuditLogDto {
  id: number;
  action: string;
  details?: string;
  timestamp: string;
}
