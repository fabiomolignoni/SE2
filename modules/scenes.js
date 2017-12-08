////////////////////////////////
// MODULI E VARIABILI GLOBALI //
////////////////////////////////


//Operazioni API
const api = require('./api_actions');

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
            console.log('\n* Comando /help selezionato *');
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
            if (adReq.q != '') {
                adReq.offset += 3;
                ctx.flow.enter('search');
            } else {
                ctx.reply('Nessuna ricerca effettuata.\n' +
                          '/cerca per iniziare una ricerca');
                ctx.flow.leave();
            }            
            break;
        case '/contatta':
            console.log('\n* Comando /contatta selezionato *');
            ctx.reply('Comando WIP');
            ctx.flow.leave();
            break;
        case '/sito':
            console.log('\n* Comando /sito selezionato *');
            ctx.replyWithMarkdown('[Clicca qui](' + config.homepage + ') per accedere al sito!');
            ctx.flow.leave();
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
    
    var query1 = new Promise((resolve, reject) => {
        ctx.reply('Cosa stai cercando?')
        .then(() => resolve());
    });

    query1.then(() => ctx.flow.wizard.next());
},
                               (ctx) => {
    printStates('query 2');
    
    var query2 = new Promise((resolve, reject) => {
        if (!ctx.message) {
            return ctx.reply('Non ho capito.');
        }
        adReq.q = ctx.message.text;
        console.log('Query: ' + adReq.q);
        resolve();
    });

    query2.then(() => ctx.flow.enter('category'));
}
                                  );

//CATEGORIA
const categoryScene = new WizardScene('category',
                                      (ctx) => {
    printStates('category 1');
    
    category1 = new Promise((resolve, reject) => {    
        ctx.reply('Filtra per categoria.', Markup.inlineKeyboard([
            Markup.callbackButton('Tutto', 'cat_tutto'),
            Markup.callbackButton('📕', 'libri'),
            Markup.callbackButton('🗒', 'appunti'),
            Markup.callbackButton('⚒', 'stage/lavoro'),
            Markup.callbackButton('🎓', 'ripetizioni'),
            Markup.callbackButton('🎪', 'eventi')
        ]).extra()
                 )
        .then(() => resolve());
    });

    category1.then(() => ctx.flow.wizard.next());
},
                                      (ctx) => {
    printStates('category 2');
    
    var category2 = new Promise((resolve, reject) => {
        if (!ctx.update.callback_query) {
            return ctx.reply('Premi uno dei pulsanti.');
        }

        adReq.category = ctx.update.callback_query.data
        var categoryName = '';

        console.log('Categoria: ' + adReq.category);

        switch (adReq.category) {
            case 'cat_tutto':
                adReq.category = '';
                categoryName = 'Tutto';
                break;
            case 'libri':
                categoryName = 'Libri';
                break;
            case 'appunti':
                categoryName = 'Appunti';
                break;
            case 'stage/lavoro':
                categoryName = 'Stage/Lavoro';
                break;
            case 'ripetizioni':
                categoryName = 'Ripetizioni';
                break;
            case 'eventi':
                categoryName = 'Eventi';
                break;
            default:
                return ctx.reply('Premi uno dei pulsanti.');
        }

        ctx.replyWithMarkdown('Hai scelto la categoria *' + categoryName + '*')
        .then(() => resolve());
    });
    
    category2.then(() => {
        ctx.flow.enter('maxPrice');
    });    
}
                                     );

//PREZZO MASSIMO
const maxPriceScene = new WizardScene('maxPrice',
                                      (ctx) => {
    printStates('maxPrice 1');
    
    var maxPrice1 = new Promise((resolve, reject) => {
        ctx.reply('Filtra per prezzo.', Markup.inlineKeyboard([
            Markup.callbackButton('Tutto', 'pr_tutto'),
            Markup.callbackButton('Scegli massimo', 'max'),
            Markup.callbackButton('Gratis', 'gratis')
        ]).extra()
                 )
        .then(() => resolve());
    });
    
    maxPrice1.then(() => ctx.flow.wizard.next());
},
                                      (ctx) => {
    printStates('maxPrice 2');
        
    var maxPrice2 = new Promise((resolve, reject) => {
        if (!ctx.update.callback_query) {
            return ctx.reply('Premi uno dei pulsanti.');
        }
        const maxPriceChoice = ctx.update.callback_query.data;
        console.log('Scelta prezzo: ' + maxPriceChoice);
        resolve(maxPriceChoice);
    });
    
    maxPrice2.then((maxPriceChoice) => {
        switch (maxPriceChoice) {
            case 'max':
                ctx.reply('Scegli il prezzo massimo.');
                ctx.flow.wizard.next();
                break;
            case 'pr_tutto':
                adReq.lessThan = '';
                ctx.flow.enter('search');
                break;
            case 'gratis':
                adReq.lessThan = 0.01;
                ctx.flow.enter('search');
                break;
            default:
                return ctx.reply('Scegli una delle opzioni.');
        }
    });
},
                                      (ctx) => {
    printStates('maxPrice 3');
    
    var maxPrice3 = new Promise((resolve, reject) => {
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
        resolve();
    });
    
    maxPrice3.then(() => ctx.flow.enter('search'));
});

//ANNUNCI
const searchScene = new WizardScene('search',
                                      (ctx) => {
    printStates('search 1');
    
    var search1 = new Promise((resolve, reject) => {
        const url = `${adReq.site}/ads/?q=${adReq.q}&title=${adReq.title}&category=${adReq.category}&lessThan=${adReq.lessThan}&limit=${adReq.limit}&offset=${adReq.offset}&fromLast=${adReq.fromLast}&user=${adReq.user}`;
        console.log('Richiesta a ' + url);
        api.getAds(ctx, url);
        resolve();
    });
    
    search1.then(() => ctx.flow.leave());
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