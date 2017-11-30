const Telegraf = require('telegraf');
const bot = new Telegraf("464793317:AAHgXUyAbg3ZRSE12i6YrwxAKgIl4fu-1R4");

function launchbot(){
    //Visualizza i comandi disponibili
    bot.command('/help', ({ reply }) => reply("/help - Visualizza i comandi disponibili\n" +
                                              "/cerca - Cerca un annuncio\n" +
                                              "/continua - Cerca altri annunci simili\n" +
                                              "/contatta - Visualizza come contattare il venditore\n" +
                                              "/sito - Apri il sito web di MessageInABOT"));
    
    //Apre il sito web di MessageInABOT
    bot.command('/sito', ({ reply }) => reply("Clicca sul link per accedere al sito!\n https://fabiomolignoni.github.io/SE2/"));
    bot.startPolling();
}

module.exports.launchbot = launchbot;

//launchbot();
