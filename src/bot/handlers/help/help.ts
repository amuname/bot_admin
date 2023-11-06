// import { prismaFindUnique } from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function help(bot: Telegraf) {
  bot.help(async (ctx) => ctx.replyWithHTML(phrases[2]));
}
