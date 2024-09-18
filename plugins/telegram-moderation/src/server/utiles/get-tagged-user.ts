import { Context } from 'grammy';

export function getTaggedUser(ctx: Context) {
  if (ctx.message?.reply_to_message) {
    return ctx.message.reply_to_message.from?.id;
  }

  const entities = ctx.message?.entities;
  if (!entities) return;

  const taggedUser = entities.find((entity) => entity.type === 'mention');
  if (!taggedUser) return;

  const userId = ctx.message?.text?.slice(taggedUser.offset, taggedUser.length);
  return userId;
}
