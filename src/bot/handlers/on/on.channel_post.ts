import { PARSER_IP } from '../../../env';
import { predicateChannelPostText } from '../../../bot/predicate/channel_post_with_text.predicate';
import {
  prismaCreateActiveChannel,
  prismaFindUserByInvitational,
} from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';
import { title } from 'process';

export async function on_channelPost(bot: Telegraf) {
  // логика постов группы
  bot.on(['channel_post'], async (ctx) => {
    console.log('GROUP MESSAGE ', ctx.channelPost);
    if (!predicateChannelPostText(ctx.channelPost)) return;
    if (!ctx.channelPost.text.includes('/invitational')) return;
    const invitationalUUID = ctx.channelPost.text.replace('/invitational ', '');
    ctx.deleteMessage();
    const invite = await prismaFindUserByInvitational(invitationalUUID);
    if (!invite) return;
    ctx.telegram.sendMessage(invite.admin_tg_user_id, phrases[25]);
    const chatLink = await ctx.telegram.createChatInviteLink(ctx.chat.id);

    // const selfIdRes = await fetch(
    //   `${PARSER_IP}/tgBot/joinChannelOrRequest?channelUrl=${encodeURIComponent(
    //     chatLink.invite_link,
    //   )}`,
    // );

    // const selfId = await selfIdRes.text();
    // console.log('SELF_ID \n', selfId, '\n');

    // if (!selfId) return ctx.reply(phrases[29]);
    // await ctx.telegram.promoteChatMember(ctx.chat.id, Number(selfId), {
    //   can_manage_chat: true,
    //   can_post_messages: true,
    // });

    // await prismaCreateActiveChannel(
    //   String(ctx.chat.id),
    //   Number(selfId),
    //   ctx.chat.title,
    //   ctx.chat.username,
    // );
    await prismaCreateActiveChannel(
      String(ctx.chat.id),
      Number(1079919770),
      ctx.chat.title,
      ctx.chat.username,
    );
  });
}
