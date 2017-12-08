////////////
// MODULI //
////////////

//Richieste HTTP
const axios = require('axios');

//Bot di Telegram
const Telegraf = require('telegraf');
const bot = new Telegraf('492970626:AAEa0HmNUlV82sPYN1LY5QRSXjay2xjVcTE');

//Scene
const scenes = require('./scenes');

//Controllo del flusso
const TelegrafFlow = require('telegraf-flow');
const { WizardScene } = TelegrafFlow;
const flow = new TelegrafFlow([scenes.commandScene, scenes.queryScene, scenes.categoryScene, scenes.maxPriceScene, scenes.searchScene], { defaultScene: 'command' });
bot.use(Telegraf.session());
bot.use(flow.middleware());



//////////
// MAIN //
//////////

//Gestisce i comandi del bot
function launchbot(){
    console.log('Bot avviato');
    
    bot.command((ctx) => ctx.flow.enter('command'));
        
    //Mette il bot in ascolto
    bot.startPolling();
}

module.exports.launchbot = launchbot;

//UTILIZZARE PER DEBUG
launchbot();