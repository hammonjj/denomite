import { RouterContext } from "@oak/oak";
import { UserGroupService } from "../services/userGroupService.ts";
import { CreateUserGroupDto } from "../dto/createUserGroupDto.ts";

export class UserGroupController {
  constructor(private userGroupService: UserGroupService) {}

  getAllUserGroups(ctx: RouterContext<string, Record<string | number | symbol, never>, Record<string, any>>) {
    const userGroups = this.userGroupService.getAllUserGroups();
    ctx.response.body = userGroups;
  }

  getUserGroup(ctx: RouterContext<string, { userId: string; groupId: string }, Record<string, any>>) {
    const userGroup = this.userGroupService.getUserGroup(+ctx.params.userId, +ctx.params.groupId);
    if (userGroup) {
      ctx.response.body = userGroup;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User-Group relation not found" };
    }
  }

  async createUserGroup(ctx: RouterContext<string, Record<string | number | symbol, never>, Record<string, any>>) {
    const body = await ctx.request.body;
    const userGroupData: CreateUserGroupDto = body as unknown as CreateUserGroupDto;

    const createdUserGroup = this.userGroupService.createUserGroup(userGroupData);
    ctx.response.body = createdUserGroup;
  }

  deleteUserGroup(ctx: RouterContext<string, { userId: string; groupId: string }, Record<string, any>>) {
    const userId = +ctx.params.userId;
    const groupId = +ctx.params.groupId;

    this.userGroupService.deleteUserGroup(userId, groupId);
    ctx.response.status = 204;
  }
}
