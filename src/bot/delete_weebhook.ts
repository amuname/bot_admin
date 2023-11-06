import 'dotenv/config';

(async function () {
  const url = `https://api.telegram.org/bot${process.env.SETUP_BOT_TOKEN}/deleteWebhook`;
  const res = await fetch(url);
  console.log(await res.json());
})();
