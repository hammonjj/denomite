import { SSQL } from "smallormSqlite";
import { UserModel } from "../models/userModel.ts";
import { CreateUserDto } from "../dto/createUserDto.ts";
import type { Database } from './database.ts';
import type { UserDto } from '../dto/UserDto.ts';
import { GroupModel } from '../models/groupModel.ts';
import { UserGroupModel } from '../models/userGroupModel.ts';

export class UserRepository {
  private orm: SSQL;

  constructor(db: Database) {
    this.orm = db.getORM();
  }

  getAllUsers(): UserDto[] {
    const users = this.orm.findMany(UserModel, {});
    return users.map(user => {
      const group = this.orm.findOne(UserGroupModel, user.id)?.groupId;
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        groupId: group,
      };
    });
  }

  getUserById(id: number): UserDto | null {
    const user = this.orm.findOne(UserModel, id);
    if (!user) { return null; }

    const group = this.orm.findOne(UserGroupModel, user.id)?.groupId;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      groupId: group,
    };
  }

  async createUser(userData: CreateUserDto): Promise<UserDto> {
    const user = new UserModel();
    user.name = userData.name;
    user.email = userData.email;
    await user.setPassword(userData.password);

    this.orm.save(user);

    const userGroup = new UserGroupModel();
    userGroup.userId = user.id;
    userGroup.groupId = userData.groupId;
    this.orm.save(userGroup);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      groupId: userData.groupId,
    };
  }

  deleteUser(id: number) {
    const user = this.orm.findOne(UserModel, id);
    if (user) {
      this.orm.delete(user);
    }
  }
}
