import { prismaFindUnique } from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function start(bot: Telegraf) {
  bot.start(async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id);
    if (!botUser) ctx.reply(phrases[0]);
    else ctx.reply(phrases[1]);
  });
}
