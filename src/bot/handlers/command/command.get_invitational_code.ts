import { Telegraf } from 'telegraf';
import { prismaFindUnique } from '../../../prisma';
import { phrases } from '../../../textReply';

export async function command_getInvitationalCode(bot: Telegraf) {
  bot.command('get_invitational_code', async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
    if (botUser) {
      console.log('botUser', botUser);
      if (!botUser.ParserBot) return ctx.reply(phrases[5]);
      ctx.replyWithHTML(
        `Вот твой персональный код активации бота <code>${botUser.InvitationalUUID.id}</code>, зайди в канал и напиши это <code>/invitational ${botUser.InvitationalUUID.id}</code>`,
      );
    }
  });
}
