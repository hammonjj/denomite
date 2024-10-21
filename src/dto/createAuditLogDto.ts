export interface CreateAuditLogDto {
  userId: number;
  action: string;
  details?: string;
  timestamp: string;
}
