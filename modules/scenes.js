////////////////////////////////
// MODULI E VARIABILI GLOBALI //
////////////////////////////////


//Operazioni API
const api = require('./api_actions1');

//Configurazione del sito
const config = require('../config');

//Controllo del flusso
const TelegrafFlow = require('telegraf-flow');
const { WizardScene } = TelegrafFlow;

//Markup del bot
const { Markup } = require('telegraf');

//Modalità debug
const debug = true;

//Parametri della richiesta degli annunci
var adReq = {
    site: config.site,
    q: '',
    title: '',
    category: '',
    lessThan: '',
    limit: 3,
    offset: 0,
    fromLast: '',
    user: ''
}



///////////
// SCENE //
///////////


//COMANDI
const commandScene = new WizardScene('command',
                                    (ctx) => {
    if(!ctx.message) {
        return ctx.reply('Inserisci un comando.');
    }
    
    var command = ctx.message.text;
    
    switch (command) {
        case '/help':
            console.log('* Comando /help selezionato *');
            ctx.reply('/help - Visualizza i comandi disponibili\n' +
                      '/cerca - Cerca un annuncio\n' +
                      '/continua - Cerca altri annunci simili\n' +
                      '/contatta - Visualizza come contattare il venditore\n' +
                      '/sito - Apri il sito web di MessageInABOT');
            break;
        case '/cerca':
            console.log('\n* Comando /cerca selezionato *');
            adReq.offset = 0;
            ctx.flow.enter('query');
            break;
        case '/continua':
            console.log('\n* Comando /continua selezionato *');
            adReq.offset += 3;
            ctx.flow.enter('search');
            break;
        case '/contatta':
            console.log('\n* Comando /contatta selezionato *');
            ctx.reply('Comando WIP');
            break;
        case '/sito':
            console.log('\n* Comando /sito selezionato *');
            ctx.replyWithMarkdown('[Clicca qui](https://fabiomolignoni.github.io/SE2/) per accedere al sito!');
            break;
        default:
            console.log('\n* Comando non valido *');
            ctx.reply('Comando non valido.\n' + 
                     '/help per visualizzare i comandi');
            ctx.flow.leave();
            break;
    }
}
                                    );

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
    adReq.q = ctx.message.text;
    console.log('Query: ' + adReq.q);

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
            adReq.category = '';
            break;
        case 'libri':
        case 'appunti':
        case 'stage/lavoro':
        case 'ripetizioni':
        case 'eventi':
            adReq.category = ctx.update.callback_query.data;
            break;
        default:
            return ctx.reply('Premi uno dei pulsanti.');
    }

    console.log('Categoria: ' + adReq.category);
    ctx.reply('Hai scelto la categoria ' + adReq.category);

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
        adReq.lessThan = '';
        ctx.flow.enter('search');
    } else if (maxPriceChoice == 'gratis') {
        adReq.lessThan = 0.01;
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

    adReq.lessThan = parseFloat(ctx.message.text);

    if (isNaN(adReq.lessThan)) {
        return ctx.reply('Inserisci un valore numerico.');
    } else if (adReq.lessThan < 0) {
        return ctx.reply('Inserisci un valore positivo.');
    }

    console.log('Prezzo massimo: ' + adReq.lessThan);

    ctx.flow.enter('search');
});

//ANNUNCI
const searchScene = new WizardScene('search',
                                      (ctx) => {
    search1 = new Promise((resolve, reject) => {
        printStates('search 1');
        const url = `${adReq.site}/ads/?q=${adReq.q}&title=${adReq.title}&category=${adReq.category}&lessThan=${adReq.lessThan}&limit=${adReq.limit}&offset=${adReq.offset}&fromLast=${adReq.fromLast}&user=${adReq.user}`;
        console.log('Richiesta a ' + url);
        api.getAds(ctx, url);
    });

    search1.then(() => {
        bot.command('continua', ctx.reply('Altri messaggi'));
    })
    .catch((err) => {
        console.log(err);
    });

    ctx.flow.leave();
});



//////////////
// FUNZIONI //
//////////////


//Stampa gli stati attraversati durante la conversazione se in modalità debug
function printStates(state) {
  if (debug) {
      console.log(state);
  }
};



module.exports.commandScene = commandScene;
module.exports.queryScene = queryScene;
module.exports.categoryScene = categoryScene;
module.exports.maxPriceScene = maxPriceScene;
module.exports.searchScene = searchScene;