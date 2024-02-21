import { predicateCallbackQueryWithMessage } from '../../../bot/predicate/callback_query_with_message.predicate';
import { predicateCallbackQueryWithData } from '../../../bot/predicate/callback_query_with_data.predicate';
import { prismaFindUnique, prismaSetUserState } from '../../../prisma';
import { phrases } from '../../../textReply';
import { Markup, Telegraf } from 'telegraf';
// import { inspect } from 'util';

export async function action_selectChannel(bot: Telegraf) {
  bot.action(/select_channel.*/, async (ctx) => {
    if (!predicateCallbackQueryWithMessage(ctx.callbackQuery)) return;
    if (!predicateCallbackQueryWithData(ctx.callbackQuery)) return;

    console.log(
      'ctx.callbackQuery.data\n',
      ctx.callbackQuery.data,
      '\n',
      'ctx.callbackQuery.message\n',
      ctx.callbackQuery.message,
    );

    const botUser = await prismaFindUnique(
      ctx.callbackQuery.from.id,
      true,
      true,
    ); // TO DO вынести получение юзера в мидлвары

    if (botUser) {
      // console.log(
      //   'botUser.channel\n',
      //   botUser.channel,
      //   '\n',
      //   'botUser\n',
      //   botUser,
      //   '\nbotUser.ParserBot\n',
      //   botUser.ParserBot,
      // );
      if (!botUser.ParserBot) return ctx.reply(phrases[5]);
      if (!botUser.channel) return ctx.reply(phrases[5]);
      console.log('botUser.chatState\n', botUser.chatState, '\n');
      if (botUser.chatState !== 'SELECT_CHANNEL') return ctx.reply(phrases[5]);

      const activeChannel = ctx.callbackQuery.data.replace(
        'select_channel.',
        '',
      );
      ctx.reply(
        'тест на wilcards пройден' +
          JSON.stringify(botUser.activeChannels) +
          JSON.stringify(botUser.channel),
      );

      await prismaSetUserState(
        ctx.callbackQuery.from.id,
        'SELECT_CHANNEL_SOURCES',
      );

      const buttons = botUser.channel.map((ch) =>
        Markup.button.callback(
          `Добавить: ${ch.channel_url}`,
          `slelect_channel_sources.${activeChannel};${ch.alias_id}`,
        ),
      );

      // buttons.push(
      //   Markup.button.callback('Сбросить состояние', 'discard_state'),
      // );

      const inlineMessageKeyboard = Markup.inlineKeyboard(buttons);

      // console.log(
      //   'INLINE Buttons\n',
      //   inspect(inlineMessageKeyboard, true, 7),
      //   '\n',
      // );
      ctx.reply(phrases[33], inlineMessageKeyboard);
    } else {
      ctx.reply(phrases[7]);
    }
  });
}
