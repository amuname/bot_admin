export const IS_PROD = process.env.environment == 'PRODUCTION';

export const BOT_TOKEN = IS_PROD
  ? process.env.MAIN_BOT_TOKEN
  : process.env.TEST_BOT_TOKEN;
export const PARSER_IP = IS_PROD
  ? process.env.PARSER_IP_PROD
  : process.env.PARSER_IP_DEV;
