import {
  prismaAddAdminToParserBot,
  prismaFindFirstParserBot,
  prismaFindUnique,
  prismaSetUserState,
} from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function command_registerUserInWebTg(bot: Telegraf) {
  bot.command('register_user_in_web_tg', async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
    const bot = await prismaFindFirstParserBot();
    if (bot) {
      await prismaAddAdminToParserBot(ctx.message.from.id, bot.id);
      return ctx.reply(phrases[26]);
    }
    if (botUser) {
      await prismaSetUserState(ctx.message.from.id, 'REGISTER_USER_IN_WEB_TG');
      ctx.reply(phrases[3]);
    } else {
      ctx.reply(phrases[4]);
    }
  });
}
