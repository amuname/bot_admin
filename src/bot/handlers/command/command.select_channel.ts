import { prismaFindUnique, prismaSetUserState } from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf, Markup } from 'telegraf';
// const { Markup } = ;

export async function command_selectChannel(bot: Telegraf) {
  bot.command('select_channel', async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id, true); // TO DO вынести получение юзера в мидлвары
    if (botUser) {
      console.log('botUser.channel\n', botUser.channel, '\n');
      if (!botUser.ParserBot) return ctx.reply(phrases[5]);
      if (!botUser.activeChannels && !botUser.activeChannels.length)
        return ctx.reply(phrases[32]);
      console.log('botUser.activeChannels\n', botUser.activeChannels, '\n');

      const buttons = botUser.activeChannels.map((ch, i) =>
        Markup.button.callback(
          `${i + 1}: ${ch.channelTitle}`,
          `select_channel.${ch.id}`,
        ),
      );

      const inlineMessageKeyboard = Markup.inlineKeyboard(buttons);

      await prismaSetUserState(ctx.message.from.id, 'SELECT_CHANNEL');
      console.log('INLINE Buttons\n', inlineMessageKeyboard, '\n');
      ctx.reply(phrases[31], inlineMessageKeyboard);
    } else {
      ctx.reply(phrases[7]);
    }
  });
}
