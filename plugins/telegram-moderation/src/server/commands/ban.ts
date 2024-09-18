import { Plugin } from '@botmate/server';
import { Composer } from 'grammy';

import { adminMiddleware } from '../middlewares/admin';
import { getTaggedUser } from '../utiles/get-tagged-user';

export default (plugin: Plugin) => {
  const ban = new Composer();

  ban.use(adminMiddleware);

  ban.command('ban', async (ctx) => {
    const user = getTaggedUser(ctx);

    console.log('user', user);

    if (!user) {
      return ctx.reply(`You need to tag a user to ban.`);
    }
  });

  return ban;
};
