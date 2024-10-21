import { Context } from '@oak/oak';

// deno-lint-ignore ban-types
export async function logger(ctx: Context, next: Function) {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  await next();
}
