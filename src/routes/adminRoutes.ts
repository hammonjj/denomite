import { Router, Context, RouterMiddleware } from "@oak/oak";
import { container } from "../utils/diContainer.ts";
import { AdminController } from "../controllers/adminController.ts";

const injectAdminController: RouterMiddleware<string> = async (ctx, next) => {
  ctx.state.adminController = container.resolve<AdminController>("AdminController");
  await next();
};

const router = new Router();

router
  .get("/admin", injectAdminController, (ctx: Context) => ctx.state.adminController.serveAdminInterface(ctx))
  .get("/admin/users", injectAdminController, (ctx: Context) => ctx.state.adminController.serveUserManagement(ctx))
  .get("/admin/logs", injectAdminController, (ctx: Context) => ctx.state.adminController.serveAuditLogs(ctx));

export { router as adminRoutes };
