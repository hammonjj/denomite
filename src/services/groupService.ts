import { GroupRepository } from "../repositories/groupRepository.ts";
import type { GroupDto } from '../dto/groupDto.ts';
import type { UserGroupRepository } from '../repositories/userGroupRepository.ts';

export class GroupService {
  private groupRepository: GroupRepository;
  private userGroupRepository: UserGroupRepository;

  constructor(groupRepository: GroupRepository, userGroupRepository: UserGroupRepository) {
    this.groupRepository = groupRepository;
    this.userGroupRepository = userGroupRepository;
  }

  getAllGroups(): GroupDto[] {
    return this.groupRepository.getAllGroups();
  }

  getGroupById(id: number): GroupDto | null {
    return this.groupRepository.getGroupById(id);
  }

  deleteGroup(id: number): boolean {
    const usersInGroup = this.userGroupRepository.getUsersByGroupId(id);
    if (usersInGroup.length > 0) {
      throw new Error('Group cannot be deleted. It still has users assigned.');
    }

    return this.groupRepository.deleteGroup(id);
  }
}
