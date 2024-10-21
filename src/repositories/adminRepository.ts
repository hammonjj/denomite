import { AuditLogModel } from '../models/auditLogModel.ts';
import { GroupModel } from '../models/groupModel.ts';
import { UserGroupModel } from '../models/userGroupModel.ts';
import { UserModel } from '../models/userModel.ts';
import { Database } from "../repositories/database.ts";

export class AdminRepository {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  getAllTables(): string[] {
    if (!this.db) {
      throw new Error("Database is not initialized.");
    }

    // Denodb doesn't have raw query support for listing tables
    // You'll need to track the models you define or manage tables in some other way.
    // This is a simple manual solution if you know the models in advance.
    const tables = ["users", "audit_logs", "groups", "user_groups"];
    return tables;
  }

  // deno-lint-ignore no-explicit-any
  getTableData(tableName: string): any[] {
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      throw new Error("Invalid table name.");
    }

    switch (tableName) {
      case "users":
        return this.db.getORM().findMany(UserModel, {});
      case "audit_logs":
        return this.db.getORM().findMany(AuditLogModel, {});
      case "groups":
        return this.db.getORM().findMany(GroupModel, {});
      case "user_groups":
        return this.db.getORM().findMany(UserGroupModel, {});
      default:
        throw new Error("Table not found.");
    }
  }

  async saveTableData(tableName: string, data: any): Promise<void> {
    switch (tableName) {
      case "users": {
        const user = new UserModel();
        user.name = data.name;
        user.email = data.email;
        user.id = +data.id;
        await user.setPassword(data.password);
        await this.db.getORM().save(user);
        break;
      }
      case "groups": {
        const group = new GroupModel();
        group.name = data.name;
        await this.db.getORM().save(group);
        break;
      }
      case "user_groups": {
        const userGroup = new UserGroupModel();
        userGroup.userId = data.userId;
        userGroup.groupId = data.groupId;
        await this.db.getORM().save(userGroup);
        break;
      }
      default:
        throw new Error("Table not found.");
    }
  }

  deleteTableData(tableName: string, id: number): void {
    switch (tableName) {
      case "users": {
        const user = this.db.getORM().findOne(UserModel, id);
        if (user) this.db.getORM().delete(user);
        break;
      }
      case "groups": {
        const group = this.db.getORM().findOne(GroupModel, id);
        if (group) this.db.getORM().delete(group);
        break;
      }
      case "user_groups": {
        const userGroup = this.db.getORM().findOne(UserGroupModel, id);
        if (userGroup) this.db.getORM().delete(userGroup);
        break;
      }
      default: {
        throw new Error("Table not found.");
      }
    }
  }
}