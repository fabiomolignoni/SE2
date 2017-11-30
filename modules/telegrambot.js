const Telegraf = require('telegraf');
const bot = new Telegraf("464793317:AAHgXUyAbg3ZRSE12i6YrwxAKgIl4fu-1R4");

const { Markup } = require('telegraf');


//Cerca e restituisce 3 annunci secondo i parametri richiesti
function searchAds(ctx) {
        
    const text = 'Che cosa stai cercando?';
    ctx.reply(text, 
                    Markup.inlineKeyboard([
                        Markup.callbackButton('Libri', 'books'),
                        Markup.callbackButton('Appunti', 'notes'),
                        Markup.callbackButton('Stage/Lavoro', 'jobs'),
                        Markup.callbackButton('Ripetizioni', 'lessons'),
                        Markup.callbackButton('Eventi', 'events')
                        ]).extra()
                    );
    
    /*
    bot.on('callback_query', ctx => {
       const category = ctx.update.callback_query.data;
    });
    reply("Inserisci il prezzo massimo.");
    //Risposta utente
    reply("Ho trovato questi annunci:");
    //Annunci
    reply("/continua per vedere ulteriori annunci.");
    */
}


//Gestisce i comandi del bot
function launchbot(){
    //Visualizza i comandi disponibili
    bot.command('/help', ({ reply }) => reply("/help - Visualizza i comandi disponibili\n" +
                                              "/cerca - Cerca un annuncio\n" +
                                              "/continua - Cerca altri annunci simili\n" +
                                              "/contatta - Visualizza come contattare il venditore\n" +
                                              "/sito - Apri il sito web di MessageInABOT"));
    
    //Cerca un annuncio
    bot.command('/cerca', ctx => searchAds(ctx));
    
    //Apre il sito web di MessageInABOT
    bot.command('/sito', ({ reply }) => reply("Clicca sul link per accedere al sito!\n https://fabiomolignoni.github.io/SE2/"));
    
    
    //Ricerca per categoria
    bot.on('callback_query', ctx => {
   
        //Salvo il messaggio ricevuto e il suo mittente
        const category = ctx.update.callback_query.data;
        const userId = ctx.update.callback_query.from.id;

        ctx.answerCbQuery('Attendi...');

        ctx.reply('Hai scelto la categoria ' + category);

        //Richiedo 3 annunci della categoria richiesta
        //...    
    
    });
    
    bot.startPolling();
}

module.exports.launchbot = launchbot;

launchbot();