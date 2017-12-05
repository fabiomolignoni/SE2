////////////
// MODULI //
////////////

//Operazioni API
const api = require('./api_actions');

//Richieste HTTP
const axios = require('axios');

//Bot di Telegram
const Telegraf = require('telegraf');
const bot = new Telegraf('492970626:AAEa0HmNUlV82sPYN1LY5QRSXjay2xjVcTE');

/*
//Controllo del flusso
const TelegrafFlow = require('telegraf-flow');
const { miabScene } = TelegrafFlow;
const flow = new TelegrafFlow([miab], { defaultScene: 'miab' });
bot.use(Telegraf.session());
bot.use(flow.middleware());
*/

//Markup bot
const { Markup } = require('telegraf');



//////////
// MAIN //
//////////

//Gestisce i comandi del bot
function launchbot(){
    console.log('Bot avviato');
    
    //Visualizza i comandi disponibili
    bot.command('help', ({ reply }) => reply('/help - Visualizza i comandi disponibili\n' +
                                              '/cerca - Cerca un annuncio\n' +
                                              '/continua - Cerca altri annunci simili\n' +
                                              '/contatta - Visualizza come contattare il venditore\n' +
                                              '/sito - Apri il sito web di MessageInABOT'));
    
    //Cerca un annuncio
    bot.command('cerca', ctx => api.searchAds(bot, ctx));
    
    //Cerca un autore
    bot.command('contatta', ctx => api.searchUsers(bot, ctx));
    
    //Apre il sito web di MessageInABOT
    bot.command('sito', ({ reply }) => reply('Clicca sul link per accedere al sito!\n https://fabiomolignoni.github.io/SE2/'));
    
    
    //bot.use(Telegraf.session());
    //bot.use(api.flow.middleware());
        
    //Mette il bot in ascolto
    bot.startPolling();
}

module.exports.launchbot = launchbot;

//UTILIZZARE PER DEBUG
launchbot();