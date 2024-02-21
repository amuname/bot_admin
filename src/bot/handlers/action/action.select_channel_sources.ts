import { predicateCallbackQueryWithMessage } from '../../predicate/callback_query_with_message.predicate';
import { predicateCallbackQueryWithData } from '../../predicate/callback_query_with_data.predicate';
import {
  connectConfigToActiveChannelByChannelId,
  prismaFindUnique,
  prismaSetUserState,
} from '../../../prisma';
import { phrases } from '../../../textReply';
import { Markup, Telegraf } from 'telegraf';
// import { inspect } from 'util';

export async function action_selectChannelSources(bot: Telegraf) {
  bot.action(/select_channel_sources.*/, async (ctx) => {
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
      if (!botUser.ParserBot) return ctx.reply(phrases[5]);
      if (!botUser.channel) return ctx.reply(phrases[5]);
      console.log('botUser.chatState\n', botUser.chatState, '\n');
      if (botUser.chatState !== 'SELECT_CHANNEL_SOURCES')
        return ctx.reply(phrases[5]);

      const [activeChannelId, channelId] = ctx.callbackQuery.data
        .replace('select_channel_sources.', '')
        .split(';');

      // TODO найти channelConfig по channel.id и связать с activeChannel по activeChannel из ctx.callbackQuery.data, создать parserTask

      await connectConfigToActiveChannelByChannelId(channelId, activeChannelId);
      createParserTaskWithChannelId
      // ctx.reply(
      //   'тест на wilcards пройден' +
      //     JSON.stringify(botUser.activeChannels) +
      //     JSON.stringify(botUser.channel),
      // );

      // const buttons = botUser.channel.map((ch) =>
      //   Markup.button.callback(
      //     `Добавить: ${ch.channel_url}`,
      //     `slelect_channel_sources.${activeChannel}.${ch.alias_id}`,
      //   ),
      // );

      // buttons.push(
      //   Markup.button.callback('Сбросить состояние', 'discard_state'),
      // );

      // const inlineMessageKeyboard = Markup.inlineKeyboard(buttons);

      // ctx.reply(phrases[33], inlineMessageKeyboard);
      await prismaSetUserState(ctx.callbackQuery.from.id, 'NONE');
    } else {
      ctx.reply(phrases[7]);
    }
  });
}
