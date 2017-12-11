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
                      '/sito - Apri il sito web di MessageInABOT');
            ctx.flow.leave();
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
        case '/sito':
            console.log('\n* Comando /sito selezionato *');
            ctx.replyWithMarkdown('[Clicca qui](' + config.homepage + ') per accedere al sito!');
            ctx.flow.leave();
            break;
        default:
            console.log('\n* Comando non valido *');
            //console.log(ctx.message);
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
        .then(() => resolve()).catch((err) => console.log(err));
    });

    query1.then(() => ctx.flow.wizard.next()).catch((err) => console.log(err));
},
                               (ctx) => {
    printStates('query 2');
    
    var query2 = new Promise((resolve, reject) => {
        if (!ctx.message.text || ctx.message.text.startsWith('/')) {
            return ctx.reply('Non ho capito.');
        }
        adReq.q = ctx.message.text;
        console.log('Query: ' + adReq.q);
        resolve();
    });

    query2.then(() => ctx.flow.enter('category')).catch((err) => console.log(err));
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
        .then(() => resolve()).catch((err) => console.log(err));
    });

    category1.then(() => ctx.flow.wizard.next()).catch((err) => console.log(err));
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
        .then(() => resolve()).catch((err) => console.log(err));
    });
    
    category2.then(() => ctx.flow.enter('maxPrice')).catch((err) => console.log(err));    
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
        .then(() => resolve()).catch((err) => console.log(err));
    });
    
    maxPrice1.then(() => ctx.flow.wizard.next()).catch((err) => console.log(err));
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
    }).catch((err) => console.log(err));
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
    
    maxPrice3.then(() => ctx.flow.enter('search')).catch((err) => console.log(err));
});

//ANNUNCI
const searchScene = new WizardScene('search',
                                      (ctx) => {
    printStates('search 1');
    
    var search1 = new Promise((resolve, reject) => {
        const url = `${adReq.site}/ads/?q=${adReq.q}&title=${adReq.title}&category=${adReq.category}&lessThan=${adReq.lessThan}&limit=${adReq.limit}&offset=${adReq.offset}&fromLast=${adReq.fromLast}&user=${adReq.user}`;
        console.log('Richiesta a ' + url);
        api.getAds(ctx, url)
        .then(() => resolve()).catch((err) => console.log(err));
    });
    
    search1.then(() => ctx.flow.enter('author')).catch((err) => console.log(err));
});


const authorScene = new WizardScene('author',
                                    (ctx) => {
    printStates('author 1');
    
    var author1 = new Promise((resolve, reject) => {
        ctx.reply('/cerca per provare con altri criteri')
        .then(() => resolve());
    });
    
    author1.then(() => ctx.flow.wizard.next()).catch((err) => console.log(err));
},
                                    (ctx) => {
    printStates('author 2');
    
    var author2 = new Promise((resolve, reject) => {
        if (ctx.update.callback_query && ctx.update.callback_query.message.text.startsWith('📌')) {
            const author = ctx.update.callback_query.data;
            console.log('Autore: ' + author);
            const url = `${config.site}/users/${author}`;
            api.getUser(ctx, url)
            .then(() => resolve());
        } else if (ctx.message.text && ctx.message.text.startsWith('/')) {
            ctx.flow.enter('command');
        } else {
            return ctx.reply('Non ho capito.');
        }
    });
    
    author2.then(() => ctx.flow.leave()).catch((err) => console.log(err));
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


module.exports.scenes = [commandScene, queryScene, categoryScene, maxPriceScene, searchScene, authorScene];