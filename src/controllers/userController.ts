import { UserService } from "../services/userService.ts";

export class UserController {
  constructor(private userService: UserService) {}

  async getAllUsers(ctx: any) {
    const users = await this.userService.getAllUsers();
    ctx.response.body = users;
  }

  async getUserById(ctx: any) {
    const userId = ctx.params.id;
    const user = await this.userService.getUserById(userId);
    if (user) {
      ctx.response.body = user;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }

  async createUser(ctx: any) {
    const body = await ctx.request.body().value;
    const newUser = await this.userService.createUser(body);
    ctx.response.body = newUser;
  }
}
