import { Router, RouterMiddleware } from "@oak/oak";
import { container } from "../utils/diContainer.ts";
import { GroupController } from "../controllers/groupController.ts";

const injectGroupController: RouterMiddleware<string> = async (ctx, next) => {
  ctx.state.groupController = container.resolve<GroupController>("GroupController");
  await next();
};

const router = new Router();

router
  .get("/groups", injectGroupController, (ctx) => ctx.state.groupController.getAllGroups(ctx))
  .get("/groups/:id", injectGroupController, (ctx) => ctx.state.groupController.getGroupById(ctx));

export { router as groupRoutes };
