import { SSQL } from "smallormSqlite";
import { UserGroupModel } from "../models/userGroupModel.ts";
import { UserModel } from "../models/userModel.ts";
import { GroupModel } from "../models/groupModel.ts";
import { CreateUserGroupDto } from "../dto/createUserGroupDto.ts";
import { UserGroupDto } from "../dto/userGroupDto.ts";
import type { Database } from './database.ts';

export class UserGroupRepository {
  private orm: SSQL;

  constructor(db: Database) {
    this.orm = db.getORM();
  }

  getAllUserGroups(): UserGroupDto[] {
    const userGroups = this.orm.findMany(UserGroupModel, {});
    return userGroups.map(ug => {
      const user = this.orm.findOne(UserModel, ug.userId);
      const group = this.orm.findOne(GroupModel, ug.groupId);

      return {
        userId: ug.userId,
        groupId: ug.groupId,
        userName: user?.name || 'Unknown',
        groupName: group?.name || 'Unknown',
      };
    });
  }

  getUsersByGroupId(groupId: number): number[] {
    const userGroups = this.orm.findMany(UserGroupModel, { where: { clause: "groupId = ?", values: [groupId] } });
    return userGroups.map(ug => ug.userId);
  }

  getUserGroup(userId: number, groupId: number): UserGroupDto | null {
    const userGroup = this.orm.findMany(UserGroupModel, {}).find(ug => ug.userId === userId && ug.groupId === groupId);
    if (!userGroup) { return null; }

    const user = this.orm.findOne(UserModel, userGroup.userId);
    const group = this.orm.findOne(GroupModel, userGroup.groupId);

    return {
      userId: userGroup.userId,
      groupId: userGroup.groupId,
      userName: user?.name || 'Unknown',
      groupName: group?.name || 'Unknown',
    };
  }

  createUserGroup(userGroupData: CreateUserGroupDto): UserGroupDto {
    const userGroup = new UserGroupModel();
    userGroup.userId = userGroupData.userId;
    userGroup.groupId = userGroupData.groupId;
    this.orm.save(userGroup);

    const user = this.orm.findOne(UserModel, userGroup.userId);
    const group = this.orm.findOne(GroupModel, userGroup.groupId);

    return {
      userId: userGroup.userId,
      groupId: userGroup.groupId,
      userName: user?.name || 'Unknown',
      groupName: group?.name || 'Unknown',
    };
  }

  deleteUserGroup(userId: number, groupId: number): void {
    const userGroup = this.orm.findMany(UserGroupModel, {}).find(ug => ug.userId === userId && ug.groupId === groupId);
    if (userGroup) {
      this.orm.delete(userGroup);
    }
  }
}
