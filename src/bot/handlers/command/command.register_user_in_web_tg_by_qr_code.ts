import { PARSER_IP } from '../../../env';
import { prismaFindUnique, prismaSetUserState } from '../../../prisma';
import { phrases } from '../../../textReply';
import { Telegraf } from 'telegraf';

export async function command_registerUserInWebTgByQrCode(bot: Telegraf) {
  bot.command('register_user_in_web_tg_by_qr_code', async (ctx) => {
    const botUser = await prismaFindUnique(ctx.message.from.id); // TO DO вынести получение юзера в мидлвары
    if (botUser) {
      if (botUser.ParserBot) return ctx.reply(phrases[19]);

      await prismaSetUserState(
        ctx.message.from.id,
        'REGISTER_USER_IN_WEB_TG_BY_QR_CODE',
      );

      const qrCodeRes = await fetch(`${PARSER_IP}/tgBot/loginByQrCode`);
      // console.log('qrCodeRes: ', qrCodeRes, '');
      const qrCode = await qrCodeRes.text();
      // console.log(
      //   'qrCode: ',
      //   qrCode,
      //   // 'qrCode ENCODED',
      //   // new URL(qrCode),
      //   // new URL(qrCode).toString(),
      // );

      await ctx.replyWithPhoto({ source: Buffer.from(qrCode, 'base64') });
      setTimeout(async () => {
        const isBotLoggedRes = await fetch(
          `${PARSER_IP}/tgBot/isBotLogged?adminId=${ctx.message.from.id}`,
        );

        if (isBotLoggedRes.ok) return ctx.reply(phrases[27]);
        ctx.reply('Еще не зарегался');
      }, 1000);
    } else {
      ctx.reply(phrases[7]);
      prismaSetUserState(ctx.message.from.id, 'NONE');
    }
  });
}
