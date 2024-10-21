import { Router, Context, RouterMiddleware } from "@oak/oak";
import { container } from "../utils/diContainer.ts";
import { AdminController } from "../controllers/adminController.ts";

const injectAdminController: RouterMiddleware<string> = async (ctx, next) => {
  ctx.state.adminController = container.resolve<AdminController>("AdminController");
  await next();
}

const router = new Router();

router
  .get("/admin", injectAdminController, (ctx: Context) => ctx.state.adminController.serveAdminInterface(ctx))
  .post("/admin/tables/:tableName/save", injectAdminController, (ctx) => ctx.state.adminController.saveTableData(ctx))
  .get("/admin/tables/:tableName/delete/:id", injectAdminController, (ctx) => ctx.state.adminController.deleteTableData(ctx))
  .get("/admin/tables/:tableName", injectAdminController, (ctx: Context) => ctx.state.adminController.serveTableData(ctx));

export { router as adminRoutes };
