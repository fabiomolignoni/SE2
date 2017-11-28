const Telegraf = require('telegraf');
const bot = new Telegraf("464793317:AAHgXUyAbg3ZRSE12i6YrwxAKgIl4fu-1R4");

function launchbot(){
  bot.command('/sito', ({ reply }) => reply("Clicca sul link per accedere al sito!\n https://fabiomolignoni.github.io/SE2/"))
  bot.startPolling();
}

module.exports.launchbot = launchbot;
