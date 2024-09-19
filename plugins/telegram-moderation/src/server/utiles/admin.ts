import { Context } from 'grammy';

export async function isSenderAdmin(ctx: Context) {
  const admins = await ctx.getChatAdministrators();
  return admins.some((admin) => admin.user.id === ctx.from?.id);
}
