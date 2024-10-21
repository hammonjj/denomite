import { SSQLTable } from "smallormSqlite";

export class AuditLogModel extends SSQLTable {
  userId!: number;
  action!: string;
  details?: string;
  timestamp!: string;
}
