import { Telegraf } from 'telegraf';
import {
  prismaFindUnique,
  prismaGetUserChannels,
  prismaSetUserState,
} from '../../..//prisma';
import { phrases } from '../../../textReply';

export async function command_addChannelConfig(bot: Telegraf) {
  bot.command('add_channel_config', async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
    if (botUser) {
      if (!botUser.ParserBot) return ctx.reply(phrases[5]);
      await prismaSetUserState(ctx.message.from.id, 'ADD_CHANEL_CONFIG');
      const channels = (
        await prismaGetUserChannels(ctx.message.from.id)
      ).channel
        .map((chnl) => `Канал : <code>${chnl.channel_url}</code>`)
        .join('\n');
      if (!channels) return ctx.reply(phrases[8]);
      await ctx.replyWithHTML(phrases[9]);
      ctx.replyWithHTML(channels);
    }
  });
}
