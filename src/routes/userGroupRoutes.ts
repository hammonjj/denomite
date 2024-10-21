import { Router, RouterMiddleware } from "@oak/oak";
import { container } from "../utils/diContainer.ts";
import { UserGroupController } from "../controllers/userGroupController.ts";

const injectUserGroupController: RouterMiddleware<string> = async (ctx, next) => {
  ctx.state.userGroupController = container.resolve<UserGroupController>("UserGroupController");
  await next();
};

const router = new Router();

router
  .get("/user-groups", injectUserGroupController, (ctx) => ctx.state.userGroupController.getAllUserGroups(ctx))
  .get("/user-groups/:userId/:groupId", injectUserGroupController, (ctx) => ctx.state.userGroupController.getUserGroup(ctx))
  .post("/user-groups", injectUserGroupController, (ctx) => ctx.state.userGroupController.createUserGroup(ctx))
  .delete("/user-groups/:userId/:groupId", injectUserGroupController, (ctx) => ctx.state.userGroupController.deleteUserGroup(ctx));

export { router as userGroupRoutes };
