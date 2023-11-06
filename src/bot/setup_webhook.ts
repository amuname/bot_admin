import 'dotenv/config';

(async function () {
  const url = `https://api.telegram.org/bot${process.env.SETUP_BOT_TOKEN}/setWebhook?url=${process.env.WEBHOOK_URL}&drop_pending_updates=true`;
  const res = await fetch(url);
  console.log(await res.json());
})();
