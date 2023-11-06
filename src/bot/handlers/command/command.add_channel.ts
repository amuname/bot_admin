import { prismaFindUnique, prismaSetUserState } from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function command_addChannel(bot: Telegraf) {
  bot.command('add_channel', async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
    if (botUser) {
      if (!botUser.ParserBot) return ctx.reply(phrases[5]);
      await prismaSetUserState(ctx.message.from.id, 'ADD_CHANEL');
      ctx.reply(phrases[6]);
    } else {
      ctx.reply(phrases[7]);
    }
  });
}
