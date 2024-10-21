import { SSQL } from "smallormSqlite";
import { UserModel } from "../models/userModel.ts";
import { AuditLogModel } from "../models/auditLogModel.ts";
import { readJson } from "readJson";
import { GroupModel } from '../models/groupModel.ts';
import { UserGroupModel } from '../models/userGroupModel.ts';

export class Database {
  private orm: SSQL;

  constructor(private useTestDB: boolean) {
    const dbFile = this.useTestDB ? ":memory:" : "./database.sqlite";
    this.orm = new SSQL(dbFile, [UserModel, AuditLogModel, GroupModel, UserGroupModel]);

    this.initializeDatabase().catch((err) => {
      console.error("Failed to initialize the database:", err);
    });
  }

  getORM(): SSQL {
    return this.orm;
  }

  private async initializeDatabase(): Promise<void> {
    if (this.useTestDB) {
      const dummyData = await readJson(`${Deno.cwd()}/src/repositories/dummyData.json`);
      await this.loadDummyDataIntoDB(dummyData);
    }
  }

  private loadDummyDataIntoDB(dummyData: any): void {
    for (const user of dummyData.users) {
      const newUser = new UserModel();
      newUser.name = user.name;
      newUser.email = user.email;
      this.orm.save(newUser);
    }

    for (const log of dummyData.auditLogs) {
      const newLog = new AuditLogModel();
      newLog.userId = log.userId;
      newLog.action = log.action;
      newLog.details = log.details;
      newLog.timestamp = log.timestamp;
      this.orm.save(newLog);
    }

    for (const group of dummyData.groups) {
      const newGroup = new GroupModel();
      newGroup.name = group.name;
      this.orm.save(newGroup);
    }

    for (const userGroup of dummyData.userGroups) {
      const newUserGroup = new UserGroupModel();
      newUserGroup.userId = userGroup.userId;
      newUserGroup.groupId = userGroup.groupId;
      this.orm.save(newUserGroup);
    }

    console.log("Dummy data loaded into in-memory DB");
  }
}