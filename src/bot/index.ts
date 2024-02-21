import 'dotenv/config';
import { Telegraf } from 'telegraf';
// import { predicateMessageWithText } from './predicate/message_with_text.predicate';
// import {
//   prisma,
//   prismaCreateAdmin,
//   prismaCreateAdminChannel,
//   prismaCreateAdminChannelConfig,
//   prismaFindUnique,
//   prismaFindUserByInvitational,
//   prismaGetUserChannels,
//   prismaSetUserState,
// } from '../prisma';
// import { predicateChannelPostText } from './predicate/channel_post_with_text.predicate';
// import { phrases } from '../textReply';
import { start } from './handlers/start/start';
import { command_registerUserInWebTg } from './handlers/command/command.register_user_in_web_tg';
import { help } from './handlers/help/help';
import { command_addChannel } from './handlers/command/command.add_channel';
import { command_addChannelConfig } from './handlers/command/command.add_channel_config';
import { url_regexpTMe } from './handlers/url/url.regexp_t_me';
import { on_channelPost } from './handlers/on/on.channel_post';
import { BOT_TOKEN } from '../env';
import { on_messageAndEditedMessage } from './handlers/on/on.message_and_edited_message';
import { command_registerUserInWebTgByQrCode } from './handlers/command/command.register_user_in_web_tg_by_qr_code';
import { command_isBotLogged } from './handlers/command/command.is_bot_logged';
import { command_getInvitationalCode } from './handlers/command/command.get_invitational_code';
import { command_selectChannel } from './handlers/command/command.select_channel';
import { action_selectChannel } from './handlers/action/action.select_channel';
import { action_selectChannelSources } from './handlers/action/action.select_channel_sources';

// const IS_PROD = process.env.environment == 'PRODUCTION';

// const BOT_TOKEN = IS_PROD
//   ? process.env.MAIN_BOT_TOKEN
//   : process.env.TEST_BOT_TOKEN;
// const PARSER_IP = IS_PROD
//   ? process.env.PARSER_IP_PROD
//   : process.env.PARSER_IP_DEV;

export const bot = new Telegraf(BOT_TOKEN);

[
  start,
  help,
  command_registerUserInWebTg,
  command_registerUserInWebTgByQrCode,
  command_addChannel,
  command_isBotLogged,
  command_addChannelConfig,
  command_getInvitationalCode,
  command_selectChannel,
  action_selectChannel,
  action_selectChannelSources,
  url_regexpTMe,
  on_messageAndEditedMessage,
  on_channelPost,
].forEach((handler) => handler(bot));
// bot;

// bot.start(async (ctx) => {
//   const botUser = await prismaFindUnique(ctx.message.from.id);
//   if (!botUser) ctx.reply(phrases[0]);
//   else ctx.reply(phrases[1]);
// });

// bot.help(async (ctx) => ctx.replyWithHTML(phrases[2]));

// обрабатываю команды до сообщений
// bot.command('register_user_in_web_tg', async (ctx) => {
//   const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
//   if (botUser) {
//     await prismaSetUserState(ctx.message.from.id, 'REGISTER_USER_IN_WEB_TG');
//     ctx.reply(phrases[3]);
//   } else {
//     ctx.reply(phrases[4]);
//   }
// });

// bot.command('add_channel', async (ctx) => {
//   const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
//   if (botUser) {
//     if (!botUser.ParserBot) return ctx.reply(phrases[5]);
//     await prismaSetUserState(ctx.message.from.id, 'ADD_CHANEL');
//     ctx.reply(phrases[6]);
//   } else {
//     ctx.reply(phrases[7]);
//   }
// });

// bot.command('add_channel_config', async (ctx) => {
//   const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
//   if (botUser) {
//     if (!botUser.ParserBot) return ctx.reply(phrases[5]);
//     await prismaSetUserState(ctx.message.from.id, 'ADD_CHANEL_CONFIG');
//     const channels = (await prismaGetUserChannels(ctx.message.from.id)).channel
//       .map((chnl, index) => `Канал : <code>${chnl.channel_url}<code>`)
//       .join('\n');
//     if (!channels) return ctx.reply(phrases[8]);
//     await ctx.reply(phrases[9]);
//     ctx.replyWithHTML(channels);
//   }
// });

// bot.command('get_invitational_code', async (ctx) => {
//   const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
//   if (botUser) {
//     if (!botUser.ParserBot) return ctx.reply(phrases[5]);
//     ctx.replyWithHTML(
//       `Вот твой персональный код активации бота <code>${botUser.InvitationalUUID.id}</code>, зайди в канал и напиши это <code>/invitational ${botUser.InvitationalUUID.id}</code>`,
//     );
//   }
// });

// bot.url(/t.me\//, async (ctx) => {
//   if (!predicateMessageWithText(ctx.message)) return;
//   const botUser = await prismaFindUnique(ctx.message.from.id);
//   if (botUser) {
//     switch (botUser.chatState) {
//       case 'ADD_CHANEL':
//         const adminChannel = await prismaCreateAdminChannel(
//           ctx.message.text,
//           ctx.message.from.id,
//         );
//         if (adminChannel) {
//           await prismaSetUserState(ctx.message.from.id, 'NONE');
//           ctx.reply(phrases[10]);
//         } else {
//           await prismaSetUserState(ctx.message.from.id, 'NONE');
//           ctx.reply(phrases[11]);
//         }
//         break;
//       default:
//         ctx.reply(phrases[12]);
//     }
//   } else ctx.replyWithHTML(phrases[13]);
// });

// // логика текстовых сообщений
// bot.on(['message', 'edited_message'], async (ctx) => {
//   // console.log('botMessage!!!', ctx.message)
//   const botUser = await prismaFindUnique(ctx.message.from.id);

//   // логика обработки сообщения когда получаем состояние пользователя из бд
//   if (botUser) {
//     switch (botUser.chatState) {
//       case 'NONE':
//         return ctx.reply(phrases[14]);
//       case 'REGISTER_USER_IN_WEB_TG':
//         if (!predicateMessageWithText(ctx.message)) return;
//         const [country_code, phone_number] = ctx.message.text.split('|');
//         if (!(country_code && phone_number)) return ctx.reply(phrases[15]);
//         await prismaCreateAdmin(
//           ctx.message.from.id,
//           ctx.message.from.first_name,
//           false,
//           JSON.stringify(ctx.message),
//           country_code + '|' + phone_number,
//         );

//         ctx.reply('Запускаю парсер');
//         const start_res = await fetch(
//           `${PARSER_IP}/start?countryCode=${country_code}&phoneNumber=${phone_number}`,
//         );

//         if (start_res.ok) {
//           const start_update = await prismaSetUserState(
//             ctx.message.from.id,
//             'REGISTER_USER_IN_WEB_TG_VERIFY_CODE',
//           );
//           if (start_update)
//             ctx.reply(phrases[16] + country_code + phone_number);
//           else ctx.reply(phrases[17]);
//         } else {
//           await prismaSetUserState(ctx.message.from.id, 'NONE');
//           ctx.reply(phrases[18]);
//         }
//         break;
//       case 'REGISTER_USER_IN_WEB_TG_VERIFY_CODE':
//         if (!predicateMessageWithText(ctx.message)) return;
//         const verify_res = await fetch(
//           `${PARSER_IP}/verify?verifyCode=${ctx.message.text}`,
//         );
//         if (verify_res.ok) {
//           await prismaSetUserState(ctx.message.from.id, 'NONE');
//           ctx.reply(phrases[19]);
//         } else {
//           await prismaSetUserState(ctx.message.from.id, 'NONE');
//           ctx.reply(phrases[18]);
//         }
//         break;
//       case 'ADD_CHANEL':
//         //  тут нет логики потому что будет обрабатываться в bot.url
//         break;
//       case 'ADD_CHANEL_CONFIG':
//         if (!predicateMessageWithText(ctx.message)) return;
//         const [channel_url, channel_tags] = ctx.message.text.split(':');
//         if (!(channel_url && channel_tags)) return ctx.reply(phrases[20]);
//         const config_data = await prismaCreateAdminChannelConfig(
//           ctx.message.from.id,
//           channel_url,
//           channel_tags,
//           true,
//         );
//         if (config_data) {
//           await prismaSetUserState(ctx.message.from.id, 'NONE');
//           return ctx.reply(phrases[21]);
//         }
//         await prismaSetUserState(ctx.message.from.id, 'NONE');
//         ctx.reply(phrases[22]);
//     }
//   }
//   if (!predicateMessageWithText(ctx.message)) return;
//   const [login, password] = ctx.message.text.split('|');

//   if (
//     IS_PROD
//       ? login === process.env.LOGIN_PROD && password === process.env.PASS_PROD
//       : login === process.env.LOGIN_DEV && password === process.env.PASS_DEV
//   ) {
//     const user = await prismaCreateAdmin(
//       ctx.message.from.id,
//       ctx.message.from.first_name,
//       false,
//       JSON.stringify(ctx.message),
//     );

//     if (user) ctx.reply(phrases[23]);
//     else ctx.reply(phrases[24]);
//     // ctx.setChatMenuButton({
//     //     type: 'web_app',
//     //     text: 'setup',
//     //     web_app: { url: 'asd' },
//     // })
//   } else {
//     ctx.reply(phrases[24]);
//   }
// });

// // логика постов группы
// bot.on(['channel_post'], async (ctx) => {
//   console.log('GROUP MESSAGE ', ctx.channelPost);
//   if (!predicateChannelPostText(ctx.channelPost)) return;
//   if (!ctx.channelPost.text.includes('/invitational')) return;
//   const invitationalUUID = ctx.channelPost.text.replace('/invitational ', '');
//   ctx.deleteMessage();
//   const invite = await prismaFindUserByInvitational(invitationalUUID);
//   if (!invite) return;
//   ctx.telegram.sendMessage(invite.admin_tg_user_id, phrases[25]);
// });
