import { UserGroupRepository } from "../repositories/userGroupRepository.ts";
import { CreateUserGroupDto } from "../dto/createUserGroupDto.ts";
import { UserGroupDto } from "../dto/userGroupDto.ts";

export class UserGroupService {
  private userGroupRepository: UserGroupRepository;

  constructor(userGroupRepository: UserGroupRepository) {
    this.userGroupRepository = userGroupRepository;
  }

  getAllUserGroups(): UserGroupDto[] {
    return this.userGroupRepository.getAllUserGroups();
  }

  getUserGroup(userId: number, groupId: number): UserGroupDto | null {
    return this.userGroupRepository.getUserGroup(userId, groupId);
  }

  createUserGroup(userGroupData: CreateUserGroupDto): UserGroupDto {
    return this.userGroupRepository.createUserGroup(userGroupData);
  }

  deleteUserGroup(userId: number, groupId: number): void {
    this.userGroupRepository.deleteUserGroup(userId, groupId);
  }
}
