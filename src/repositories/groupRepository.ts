import { SSQL } from "smallormSqlite";
import { GroupModel } from "../models/groupModel.ts";
import { GroupDto } from "../dto/groupDto.ts";
import type { Database } from './database.ts';

export class GroupRepository {
  private orm: SSQL;

  constructor(db: Database) {
    this.orm = db.getORM();
  }

  getAllGroups(): GroupDto[] {
    const groups = this.orm.findMany(GroupModel, {});
    return groups.map(group => ({
      id: group.id,
      name: group.name,
    }));
  }

  getGroupById(id: number): GroupDto | null {
    const group = this.orm.findOne(GroupModel, id);
    if (!group) { return null; }

    return {
      id: group.id,
      name: group.name,
    };
  }

  deleteGroup(id: number): boolean {
    const group = this.orm.findOne(GroupModel, id);
    if (!group) return false;

    this.orm.delete(group);
    return true;
  }
}
