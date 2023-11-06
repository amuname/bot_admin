// import { prismaFindUnique } from '../../../prisma';
import { PARSER_IP } from '../../../env';
import { predicateMessageWithText } from '../../../bot/predicate/message_with_text.predicate';
import {
  prismaCreateAdminChannel,
  prismaFindUnique,
  prismaSetUserState,
} from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function url_regexpTMe(bot: Telegraf) {
  bot.url(/t.me\//, async (ctx) => {
    if (!predicateMessageWithText(ctx.message)) return;
    const botUser = await prismaFindUnique(ctx.message.from.id);
    if (botUser) {
      switch (botUser.chatState) {
        case 'ADD_CHANEL':
          const channel_res = await fetch(
            `${PARSER_IP}/tgBot/joinChannelOrRequest?channelUrl=${encodeURIComponent(
              ctx.message.text,
            )}`,
          );
          let adminChannel;
          if (channel_res.ok)
            adminChannel = await prismaCreateAdminChannel(
              ctx.message.text,
              ctx.message.from.id,
            );

          if (channel_res.ok && adminChannel) {
            ctx.reply(phrases[10]);
          } else {
            ctx.reply(phrases[11]);
          }
          await prismaSetUserState(ctx.message.from.id, 'NONE');
          break;
        default:
          ctx.reply(phrases[12]);
      }
    } else ctx.replyWithHTML(phrases[13]);
  });
}
