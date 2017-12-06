////////////
// MODULI //
////////////

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



//////////////
// FUNZIONI //
//////////////


//Recupera gli annunci tramite API
function getAds(bot, ctx, url) {
    //RICHIESTA ANNUNCI
    axios.get(url)
    .then(function (response) {
        //console.log(response);
        var ads = response.data.ads;
        console.log(ads);
        
        if(!ads) {
            return ctx.reply('Errore.');
        } else if (ads.length == 0) {
            return ctx.reply('Spiacente, nessun annuncio trovato.');
        }
        
        
        const i = 0; //Provvisiorio        
        ads.forEach(function (ad) {
            console.log('Trovato ' + i + ': \'' + ad.title + '\'');

            //Ricavo le informazioni sull'autore
            var author = axios.get(ad.author)
            .then (function (response) {
                var author = response.data;

                ctx.replyWithMarkdown('Annuncio ' + i + '\n' +
                          '*' + ad.title + '*\n' +
                          'Descrizione: ' + ad.desc + '\n' +
                          'Prezzo: ' + ad.price + '\n' +
                          'Categoria: ' + ad.category + '\n' +
                          'Data: ' + ad.date + '\n' +
                          'Autore: ' + author.name + ' ' + author.surname + '\n'
                      );
            })
            .catch(function (err) {
                console.log(err);
            });
        });
        
    })/*
    .then(function () {
        ctx.reply('/continua per vedere altri annunci');
    })*/
    .catch(function (err) {
        console.log(err);
    });
}

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
        console.log('query 1');
        ctx.reply('Cosa stai cercando?');
        
        ctx.flow.wizard.next();
    },
                                   (ctx) => {
        console.log('query 2');
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
        console.log('category 1');        
        ctx.reply('Filtra per categoria.', Markup.inlineKeyboard([
            Markup.callbackButton('Tutto', 'tutto'),
            Markup.callbackButton('Libri', 'libri'),
            Markup.callbackButton('Appunti', 'appunti'),
            Markup.callbackButton('Stage/Lavoro', 'stage/lavoro'),
            Markup.callbackButton('Ripetizioni', 'ripetizioni'),
            Markup.callbackButton('Eventi', 'eventi')
        ]).extra()
                 );
        
        ctx.flow.wizard.next();
    },
                                          (ctx) => {
        console.log('category 2');
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
        console.log('maxPrice 1');        
        ctx.reply('Filtra per prezzo.', Markup.inlineKeyboard([
            Markup.callbackButton('Tutto', 'tutto'),
            Markup.callbackButton('Scegli massimo', 'max'),
            Markup.callbackButton('Gratis', 'gratis')
        ]).extra()
                 );
        
        ctx.flow.wizard.next();
    },
                                          (ctx) => {
        console.log('maxPrice 2');
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
        console.log('maxPrice 3');
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
        console.log('search 1');
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