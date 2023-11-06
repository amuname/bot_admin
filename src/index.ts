import { Update } from 'telegraf/types';
import { bot } from './bot/index';
import { IS_PROD } from './env';

let handler: (event, context) => Promise<any> = async function (event: any) {
  let message: Update;
  try {
    if (!event.body) {
      throw new Error('unknown request type');
    }
    let body = event.body;
    if (event.isBase64Encoded) {
      body = base64Decode(body);
    }
    message = JSON.parse(body);
  } catch (error) {
    return {
      statusCode: 400,
      body: error.message,
    };
  }
  try {
    await bot.handleUpdate(message);
  } catch (error) {
    return {
      statusCode: 500,
      body: error.message,
    };
  }
};

function base64Decode(str: string) {
  return Buffer.from(str, 'base64').toString('utf8');
}

if (!IS_PROD)
  handler = function (_event, _context) {
    console.log('Bot local testing mode');
    return bot.launch();
  };

export { handler };
