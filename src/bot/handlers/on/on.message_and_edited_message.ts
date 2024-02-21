import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { predicateMessageWithText } from '../../../bot/predicate/message_with_text.predicate';
import { IS_PROD, PARSER_IP } from '../../../env';
import {
  // prisma,
  // prismaAddAdminToParserBot,
  prismaAddAdminToParserBotNoId,
  prismaCreateAdmin,
  prismaCreateAdminChannelConfig,
  // prismaFindFirstParserBot,
  prismaFindUnique,
  prismaSetUserState,
} from '../../../prisma';
import { phrases } from '../../../textReply';

export async function on_messageAndEditedMessage(bot: Telegraf) {
  // логика текстовых сообщений
  bot.on(['message', 'edited_message'], async (ctx) => {
    // console.log('botMessage!!!', ctx.message)
    const botUser = await prismaFindUnique(ctx.message.from.id);

    // логика обработки сообщения когда получаем состояние пользователя из бд
    if (botUser) {
      switch (botUser.chatState) {
        case 'NONE':
          return ctx.reply(phrases[14]);
        case 'REGISTER_USER_IN_WEB_TG':
          if (!predicateMessageWithText(ctx.message)) return;
          const [country_code, phone_number] = ctx.message.text.split('|');
          if (!(country_code && phone_number)) return ctx.reply(phrases[15]);
          await prismaCreateAdmin(
            ctx.message.from.id,
            ctx.message.from.first_name,
            false,
            JSON.stringify(ctx.message),
            country_code + '|' + phone_number,
          );

          ctx.reply('Запускаю парсер');
          console.log(
            'FETCH',
            fetch,
            'URL',
            `${PARSER_IP}tgBot/loginByPhone?countryCode=${country_code}&phoneNumber=${phone_number}`,
          );
          const start_res = await fetch(
            `${PARSER_IP}/tgBot/loginByPhone/?countryCode=${encodeURIComponent(
              country_code,
            )}&phoneNumber=${phone_number}`,
          );

          console.log('start_res: ', start_res);

          if (start_res.ok) {
            const start_update = await prismaSetUserState(
              ctx.message.from.id,
              'REGISTER_USER_IN_WEB_TG_VERIFY_CODE',
            );
            if (start_update)
              ctx.reply(phrases[16] + country_code + phone_number);
            else ctx.reply(phrases[17]);
          } else {
            await prismaSetUserState(ctx.message.from.id, 'NONE');
            ctx.reply(phrases[18]);
          }
          break;
        case 'REGISTER_USER_IN_WEB_TG_VERIFY_CODE':
          if (!predicateMessageWithText(ctx.message)) return;
          console.log(
            'fetch',
            fetch,
            'URL : ',
            `${PARSER_IP}/tgBot/verify?verifyCode=${ctx.message.text}&adminId=${ctx.message.from.id}`,
          );
          const verify_res = await fetch(
            `${PARSER_IP}/tgBot/verify?verifyCode=${ctx.message.text}&adminId=${ctx.message.from.id}`,
          );

          console.log('VERIFY RES: ', verify_res);
          setTimeout(async () => {
            const isBotLoggedRes = await fetch(
              `${PARSER_IP}/tgBot/isBotLogged?adminId=${ctx.message.from.id}`,
            );

            if (isBotLoggedRes.ok) {
              prismaSetUserState(ctx.message.from.id, 'NONE');
              prismaAddAdminToParserBotNoId(ctx.message.from.id);

              ctx.reply(phrases[19]);
            } else {
              await prismaSetUserState(ctx.message.from.id, 'NONE');
              ctx.reply(phrases[18]);

              ctx.reply('Еще не зарегался');
            }
          }, 1000);
          // if (verify_res.ok) {
          //   prismaSetUserState(ctx.message.from.id, 'NONE');
          //   prismaAddAdminToParserBotNoId(ctx.message.from.id);

          //   ctx.reply(phrases[19]);
          // } else {
          //   await prismaSetUserState(ctx.message.from.id, 'NONE');
          //   ctx.reply(phrases[18]);
          // }
          break;
        case 'ADD_CHANEL':
        case 'REGISTER_USER_IN_WEB_TG_BY_QR_CODE':
          //  тут нет логики потому что будет обрабатываться в bot.url
          break;
        // case 'ADD_CHANEL_CONFIG':
        //   if (!predicateMessageWithText(ctx.message)) return;
        //   const [channel_url, channel_tags] = ctx.message.text.split('|');
        //   if (!(channel_url && channel_tags)) return ctx.reply(phrases[20]);
        //   const config_data = await prismaCreateAdminChannelConfig(
        //     ctx.message.from.id,
        //     channel_url.trim(),
        //     channel_tags.trim(),
        //     true,
        //   );
        //   await prismaSetUserState(ctx.message.from.id, 'NONE');
        //   if (config_data) {
        //     return ctx.reply(phrases[21]);
        //   }
        //   ctx.reply(phrases[22]);
        //   break;
        // case 'SELECT_CHANNEL':
        //   if (!predicateMessageWithText(ctx.message)) return;
        //   const channels
        //   break;
      }
      return;
    }
    if (!predicateMessageWithText(ctx.message)) return;
    const [login, password] = ctx.message.text.split('|');

    if (
      IS_PROD
        ? login === process.env.LOGIN_PROD && password === process.env.PASS_PROD
        : login === process.env.LOGIN_DEV && password === process.env.PASS_DEV
    ) {
      // const parserBot = await prismaFindFirstParserBot();
      const user = await prismaCreateAdmin(
        ctx.message.from.id,
        ctx.message.from.first_name,
        false,
        JSON.stringify(ctx.message),
      );

      if (user) ctx.reply(phrases[23]);
      else ctx.reply(phrases[24]);
      // ctx.setChatMenuButton({
      //     type: 'web_app',
      //     text: 'setup',
      //     web_app: { url: 'asd' },
      // })
    } else {
      ctx.reply(phrases[30]);
    }
  });
}
