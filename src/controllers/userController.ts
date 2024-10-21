import { RouterContext } from "@oak/oak";
import { UserService } from "../services/userService.ts";
import type { CreateUserDto } from '../dto/createUserDto.ts';

export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers(ctx: RouterContext<string, Record<string | number | symbol, never>, Record<string, any>>)  {
    const users = this.userService.getAllUsers();
    ctx.response.body = users;
  }

  getUserById(ctx: RouterContext<string, { id: string; }, Record<string, any>>) {
    const user = this.userService.getUserById(+ctx.params.id);
    if (user) {
      ctx.response.body = user;
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "User not found" };
    }
  }

  async createUser(ctx: RouterContext<string, Record<string | number | symbol, never>, Record<string, any>>) {
    const body = await ctx.request.body;
    const newUser: CreateUserDto = body as unknown as CreateUserDto;

    const createdUser = await this.userService.createUser(newUser);
    ctx.response.body = createdUser;
  }

  deleteUser(ctx: RouterContext<string, { id: string }, Record<string, any>>) {
    const userId = +ctx.params.id;
    this.userService.deleteUser(userId);
    ctx.response.status = 204;
  }
}
