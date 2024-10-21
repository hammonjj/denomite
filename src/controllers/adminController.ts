import { Response, Context } from "@oak/oak";
import { Eta } from "@eta-dev/eta";
import { AuditLogService } from "../services/auditLogService.ts";
import type { UserService } from '../services/userService.ts';

export class AdminController {
  private userService: UserService;
  private auditLogService: AuditLogService;

  constructor(
    auditLogService: AuditLogService,
    userService: UserService,
  ) {
    this.auditLogService = auditLogService;
    this.userService = userService;
  }

  async serveAdminInterface({ response }: { response: Response }) {
    const eta = new Eta({ views: `${Deno.cwd()}/templates` });

    const body = await eta.render("admin.eta", { title: "Admin Panel" });
    if (body) {
      response.body = body;
    } else {
      response.status = 500;
      response.body = { error: "Failed to render admin interface." };
    }
  }

  async serveUserManagement(ctx: Context) {
    const users = await this.userService.getAllUsers();
    const eta = new Eta({ views: `${Deno.cwd()}/templates` });

    const body = await eta.render("users.eta", { users });
    if (body) {
      ctx.response.body = body;
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to render users." };
    }
  }

  async serveAuditLogs(ctx: Context) {
    const logs = await this.auditLogService.getLogs();
    const eta = new Eta({ views: `${Deno.cwd()}/templates` });

    const body = await eta.render("logs.eta", { logs });
    if (body) {
      ctx.response.body = body;
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to render audit logs." };
    }
  }
}
