////////////////////////////////
// MODULI E VARIABILI GLOBALI //
////////////////////////////////

//Configurazione del sito
const config = require('../config');

//Richieste HTTP
const axios = require('axios');

//Gestione bot di Telegram
const Telegraf = require('telegraf');

//Controllo del flusso
const TelegrafFlow = require('telegraf-flow');
const { WizardScene } = TelegrafFlow;

//Markup del bot
const { Markup } = require('telegraf');

//Modalità debug
var debug = true;



//////////////
// FUNZIONI //
//////////////


//Stampa gli stati attraversati durante la conversazione se in modalità debug
function printStates(state) {
  if (debug) {
      console.log(state);
  }
};


//Stampa gli annunci trovati
function printAds(bot, ctx, ads) {
    
    var promises = [];
    
    if (ads.length != 0) {
        ads.forEach((ad) => {
            var promise = new Promise((resolve, reject) => {
                console.log('Trovato "' + ad.title + '"');

                //Ricavo le informazioni sull'autore
                var author = axios.get(ad.author)
                .then ((response) => {
                    return response.data;
                })
                .then((author) => {
                    ctx.replyWithMarkdown('*' + ad.title + '*\n' +
                                          '_' + ad.desc + '_\n' +
                                          '\n' +   
                                          'Prezzo: ' + ad.price + '\n' +
                                          'Categoria: ' + ad.category + '\n' +
                                          'Data: ' + ad.date + '\n' +
                                          'Autore: ' + author.name + ' ' + author.surname + '\n'
                                         );
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                });
            });

            promises.push(promise);
        });
    } else {
        var promise = new Promise((resolve, reject) => {
            ctx.reply('Spiacente, nessun annuncio trovato.');
            resolve();
        });
        
        promises.push(promise);
    }
        
    Promise.all(promises)
    .then(() => {
        ctx.reply('/continua per vedere altri annunci');
    });
    
};


//Recupera gli annunci tramite API
function getAds(bot, ctx, url) {
        
    axios.get(url)
    .then((response) => {
        return response.data.ads;
    })
    .then((ads) => {
        printAds(bot, ctx, ads);
    })
    .catch((err) => {
        console.log(err);
    });
    
};


//Gestisce la ricerca degli annunci
function searchAds(bot, ctx) {
    
    console.log('*RICERCA ANNUNCI*');
    
    //Parametri della richiesta GET
    var site = config.site;
    var q = '';
    var title = '';
    var category = '';
    var lessThan = '';
    var limit = 3;
    var offset = '';
    var fromLast = '';
    var user = '';
    
    //QUERY
    const queryScene = new WizardScene('query',
                                   (ctx) => {
        printStates('query 1');
        ctx.reply('Cosa stai cercando?');
        
        ctx.flow.wizard.next();
    },
                                   (ctx) => {
        printStates('query 2');
        if (!ctx.message) {
            return ctx.reply('Non ho capito.');
        }
        q = ctx.message.text;
        console.log('Query: ' + q);
        
        ctx.flow.enter('category');
    }
                                      );
    
    //CATEGORIA
    const categoryScene = new WizardScene('category',
                                          (ctx) => {
        printStates('category 1');        
        ctx.reply('Filtra per categoria.', Markup.inlineKeyboard([
            Markup.callbackButton('Tutto', 'tutto'),
            Markup.callbackButton('📕', 'libri'),
            Markup.callbackButton('🗒', 'appunti'),
            Markup.callbackButton('⚒', 'stage/lavoro'),
            Markup.callbackButton('🎓', 'ripetizioni'),
            Markup.callbackButton('🎪', 'eventi')
            
            /*
            Markup.callbackButton('Tutto', 'tutto'),
            Markup.callbackButton('Libri', 'libri'),
            Markup.callbackButton('Appunti', 'appunti'),
            Markup.callbackButton('Stage/Lavoro', 'stage/lavoro'),
            Markup.callbackButton('Ripetizioni', 'ripetizioni'),
            Markup.callbackButton('Eventi', 'eventi')
            */
        ]).extra()
                 );
        
        ctx.flow.wizard.next();
    },
                                          (ctx) => {
        printStates('category 2');
        if (!ctx.update.callback_query) {
            return ctx.reply('Premi uno dei pulsanti.');
        }
        
        switch (ctx.update.callback_query.data) {
            case 'tutto':
                category = '';
                break;
            case 'libri':
            case 'appunti':
            case 'stage/lavoro':
            case 'ripetizioni':
            case 'eventi':
                category = ctx.update.callback_query.data;
                break;
            default:
                return ctx.reply('Premi uno dei pulsanti.');
        }
        
        console.log('Categoria: ' + category);
        ctx.reply('Hai scelto la categoria ' + category);
        
        ctx.flow.enter('maxPrice');
        }
                                         );
    
    //PREZZO MASSIMO
    const maxPriceScene = new WizardScene('maxPrice',
                                          (ctx) => {
        printStates('maxPrice 1');        
        ctx.reply('Filtra per prezzo.', Markup.inlineKeyboard([
            Markup.callbackButton('Tutto', 'tutto'),
            Markup.callbackButton('Scegli massimo', 'max'),
            Markup.callbackButton('Gratis', 'gratis')
        ]).extra()
                 );
        
        ctx.flow.wizard.next();
    },
                                          (ctx) => {
        printStates('maxPrice 2');
        if (!ctx.update.callback_query) {
            return ctx.reply('Premi uno dei pulsanti.');
        }
        const maxPriceChoice = ctx.update.callback_query.data;
        console.log('Scelta: ' + maxPriceChoice);
        
        if (maxPriceChoice == 'max') {
            ctx.reply('Scegli il prezzo massimo.');
            ctx.flow.wizard.next();
        } else if (maxPriceChoice == 'tutto') {
            lessThan = '';
            ctx.flow.enter('search');
        } else if (maxPriceChoice == 'gratis') {
            lessThan = 0.01;
            ctx.flow.enter('search');
        } else {
            return ctx.reply('Scegli una delle opzioni.');
        }
    },
                                          (ctx) => {
        printStates('maxPrice 3');
        if (!ctx.message) {
            return ctx.reply('Non ho capito.');
        }
        
        lessThan = parseFloat(ctx.message.text);
        
        if (isNaN(lessThan)) {
            return ctx.reply('Inserisci un valore numerico.');
        } else if (lessThan < 0) {
            return ctx.reply('Inserisci un valore positivo.');
        }
        
        console.log('Prezzo massimo: ' + lessThan);
        
        ctx.flow.enter('search');
    });
    
    //ANNUNCI
    const searchScene = new WizardScene('search',
                                          (ctx) => {
        printStates('search 1');
        const url = `${site}/ads/?q=${q}&title=${title}&category=${category}&lessThan=${lessThan}&limit=${limit}&offset=${offset}&fromLast=${fromLast}&user=${user}`;
        console.log('Richiesta a ' + url);
        getAds(bot, ctx, url);
        
        ctx.flow.leave();
    });
    
    const flow = new TelegrafFlow([queryScene, categoryScene, maxPriceScene, searchScene], { defaultScene: 'query' });
    bot.use(Telegraf.session());
    bot.use(flow.middleware());
    
}

//Cerca l'utente richiesto
function searchUsers(bot, ctx, user) {
    console.log('*RICERCA UTENTI*');
    
    console.log('WIP');
    ctx.reply('WIP');
    
    /*
    var site = config.site;
    //var user = ctx.user;
    var user = '5a16ffc34adab400040f1d39'; //Esempio per debug
    
    if (!user) {
        ctx.reply('Seleziona l\'annuncio per ottenere le informazioni sull\'autore.');
    }
    
    //RICHIESTA UTENTI
    axios.get(`${site}/users/${user}`)
    .then(function (response) {
        var info = response.data;

        ctx.reply('Nome: ' + info.name + '\n' +
                  'Cognome: ' + info.surname + '\n' +
                  'E-mail: ' + info.email + '\n' +
                  (info.phone ? ('Telefono: ' + info.phone + '\n') : '')
                  );
    })
    .catch(function (err) {
        console.log(err);
    });
    */
}

module.exports.searchAds = searchAds;
module.exports.searchUsers = searchUsers;