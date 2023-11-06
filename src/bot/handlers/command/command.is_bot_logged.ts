import { PARSER_IP } from '../../../env';
import {
  prisma,
  prismaAddAdminToParserBot,
  prismaFindFirstParserBot,
  prismaFindUnique,
  prismaSetUserState,
} from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function command_isBotLogged(bot: Telegraf) {
  bot.command('is_bot_logged', async (ctx) => {
    console.log('is_bot_logged');
    const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
    const bot = await prismaFindFirstParserBot();
    if (!botUser.ParserBot && bot) {
      console.log('alreadyHave bot, connect');
      await prisma.$transaction([
        prismaAddAdminToParserBot(ctx.message.from.id, bot.id),
        prismaSetUserState(ctx.message.from.id, 'NONE'),
      ]);
      return ctx.reply(phrases[26]);
    }
    if (!botUser.ParserBot) {
      console.log('no bot');
      await fetch(
        `${PARSER_IP}/tgBot/isBotLogged?adminId=${ctx.message.from.id}`,
      );
      await prismaSetUserState(ctx.message.from.id, 'NONE');
      ctx.reply(phrases[19]);
    } else {
      ctx.reply(phrases[28]);
      ctx.reply('или у тебя уже есть бот, попробуй добавить канал');
    }
  });
}
