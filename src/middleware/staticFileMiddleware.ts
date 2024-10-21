import { Middleware, send } from "@oak/oak";

export const StaticFileMiddleware: Middleware = async (ctx, next) => {
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = ["/static/css/admin.css"];

  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}`,
    });
  } else {
    await next();
  }
};
