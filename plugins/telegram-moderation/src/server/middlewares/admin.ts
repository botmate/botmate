import { Context, NextFunction } from 'grammy';

import { isSenderAdmin } from '../utiles/admin';

export async function adminMiddleware(ctx: Context, next: NextFunction) {
  if (await isSenderAdmin(ctx)) {
    return next();
  }

  return ctx.reply('You are not an admin.');
}
