export interface AuditLogDto {
  id: number;
  userId: number;
  action: string;
  details?: string;
  timestamp: string;
}
