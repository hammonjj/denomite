import { RouterContext } from "@oak/oak";
import { GroupService } from "../services/groupService.ts";

export class GroupController {
  constructor(private groupService: GroupService) {}

  getAllGroups(ctx: RouterContext<string, Record<string | number | symbol, never>, Record<string, any>>) {
    const groups = this.groupService.getAllGroups();
    ctx.response.body = groups;
  }

  getGroupById(ctx: RouterContext<string, { id: string }, Record<string, any>>) {
    const group = this.groupService.getGroupById(+ctx.params.id);
    if (group) {
      ctx.response.body = group;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Group not found" };
    }
  }

  async deleteGroup(ctx: RouterContext<string, { id: string }, Record<string, any>>) {
    try {
      const deleted = await this.groupService.deleteGroup(+ctx.params.id);
      if (deleted) {
        ctx.response.status = 200;
        ctx.response.body = { message: "Group deleted successfully" };
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Group not found" };
      }
    } catch (error) {
      ctx.response.status = 400;
      ctx.response.body = { message: (error as Error).message };
    }
  }
}
