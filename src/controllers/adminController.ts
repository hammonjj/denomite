import { Response, type RouterContext } from "@oak/oak";
import { Eta } from "@eta-dev/eta";
import { AdminService } from "../services/adminService.ts";

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  async serveAdminInterface({ response }: { response: Response }) {
    const eta = new Eta({ views: `${Deno.cwd()}/src/templates` });

    try {
      const tables = await this.adminService.getAllTables();
      console.log(tables);
      const body = await eta.render("admin.eta", { tables });

      if (body) {
        response.body = body;
      } else {
        response.status = 500;
        response.body = { error: "Failed to render admin interface." };
      }
    } catch (error) {
      response.status = 500;
      response.body = { error: "An error occurred while retrieving the admin interface." };
    }
  }

  async serveTableData(ctx: RouterContext<"/admin/tables/:tableName">) {
    const tableName = ctx.params.tableName;

    if (!tableName) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Table name is required" };
      return;
    }

    try {
      const tableData = await this.adminService.getTableData(tableName);
      const eta = new Eta({ views: `${Deno.cwd()}/src/templates` });
      const body = await eta.render("tableData.eta", { tableName, tableData });

      if (body) {
        ctx.response.body = body;
      } else {
        ctx.response.status = 500;
        ctx.response.body = { error: "Failed to render table data." };
      }
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { message: (error as Error).message };
    }
  }

  async saveTableData(ctx: RouterContext<"/admin/tables/:tableName/save">) {
    const tableName = ctx.params.tableName;

    if (!tableName) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Table name is required" };
      return;
    }

    let jsonBody = null;
    if (ctx.request.body.type() === "form") {
      const body = await ctx.request.body.formData();
      
      jsonBody = {} as { [key: string]: any };
      for (const [key, value] of body.entries()) {
        jsonBody[key] = value;
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { error: "Expected JSON body" };
      return;
    }

    if (!jsonBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid request body" };
      return;
    }

    try {
      await this.adminService.saveTableData(tableName, jsonBody);
      ctx.response.redirect(`/admin/tables/${tableName}`);
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to save table data" };
    }
  }

  async deleteTableData(ctx: RouterContext<"/admin/tables/:tableName/delete/:id">) {
    const tableName = ctx.params.tableName;
    const id = ctx.params.id;
    await this.adminService.deleteTableData(tableName, +id);
    ctx.response.redirect(`/admin/tables/${tableName}`);
  }
}
