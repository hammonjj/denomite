import { Router, Context, RouterMiddleware } from "@oak/oak";
import { container } from "../utils/diContainer.ts";
import { UserController } from "../controllers/userController.ts";

const injectUserController: RouterMiddleware<string> = async (ctx, next) => {
  ctx.state.userController = container.resolve<UserController>("UserController");
  await next();
};

const router = new Router();

router
  .post("/users", injectUserController, (ctx: Context) => ctx.state.userController.createUser(ctx))
  .get("/users", injectUserController, (ctx: Context) => ctx.state.userController.getAllUsers(ctx))
  .get("/users/:id", injectUserController, (ctx: Context) => ctx.state.userController.getUserById(ctx)
  .delete("/users/:id", injectUserController, (ctx: Context) => ctx.state.userController.deleteUser(ctx)));

export { router as userRoutes };
