////////////
// MODULI //
////////////

//Configurazione del sito
const config = require('../config');

//Richieste HTTP
const axios = require('axios');

//Markup del bot
const { Markup } = require('telegraf');



//////////////
// FUNZIONI //
//////////////

//Cerca 3 annunci secondo i parametri richiesti
function searchAds(bot, ctx) {
    
    
    
    //Chiedi testo
        //'Scrivi cosa vuoi cercare.'
            //TESTO
    //Chiedi categoria
        //'Filtra per categoria.'
            //PULSANTI (all, libri, appunti, stage/lavoro, ripetizioni, eventi)
    //Chiedi prezzo
        //'Filtra per prezzo.'
            //PULSANTI (tutto, scegli massimo, gratis)
    //Chiedi autore
        //'Filtra per autore.'
            //PULSANTI (tutto, scegli autore)
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    console.log('Ricerca annunci');
        
    //Selezione categoria
    const text = 'Che cosa stai cercando?';
    ctx.reply(text, 
                    Markup.inlineKeyboard([
                        Markup.callbackButton('Tutto', 'all'),
                        Markup.callbackButton('Libri', 'libri'),
                        Markup.callbackButton('Appunti', 'appunti'),
                        Markup.callbackButton('Stage/Lavoro', 'stage/lavoro'),
                        Markup.callbackButton('Ripetizioni', 'ripetizioni'),
                        Markup.callbackButton('Eventi', 'eventi')
                        ]).extra()
                    );
    
    
    //Ricerca per categoria
    bot.on('callback_query', ctx => {
   
        //Salvo il messaggio ricevuto e il suo mittente
        const category = ctx.update.callback_query.data;
        const userId = ctx.update.callback_query.from.id;
        
        console.log('Categoria: ' + category);

        ctx.answerCbQuery('Attendi...');
        ctx.reply('Hai scelto la categoria ' + category);    
        ctx.reply('Inserisci il prezzo massimo (0 per articoli gratis).');
        
        bot.on('text', ctx => {
            
            const text = ctx.message.text;
            
            try {
                maxPrice = parseFloat(text);
            } catch (err) {
                console.log(err);
            }
            
            if (isNaN(maxPrice)) {
                ctx.reply('Inserisci un valore numerico.');
            } else {
                console.log('Prezzo massimo: ' + maxPrice);
                
                /**/
                //Parametri della richiesta GET
                var site = config.site;
                var q = '';
                var title = '';
                var category = ((category == 'all') ? '' : category);
                var lessThan = maxPrice;
                var limit = 3;
                var offset = '';
                var fromLast = true;
                var user = '';
                
                //RICHIESTA ANNUNCI
                axios.get(`${site}/ads/?q=${q}&title=${title}&category=${category}&lessThan=${lessThan}&limit=${limit}&offset=${offset}&fromLast=${fromLast}&user=${user}`)
                .then(function (response) {
                    var ads = response.data.ads;
                    
                    //Itero sugli annunci trovati
                    for (var i = 0; i < ads.length; i++) {
                        var ad = ads[i];
                        
                        console.log('Annuncio ' + ads.title + ' trovato');
                        
                        //Ricavo le informazioni sull'autore
                        var author = axios.get(ad.author)
                        .then (function (response) {
                            var author = response.data;
                            
                            ctx.reply('Annuncio ' + i + '\n' +
                                      'Titolo: ' + ad.title + '\n' +
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
                        
                    }
                })
                /*.then(function () {
                    ctx.reply('/continua per vedere altri annunci');
                })*/
                .catch(function (err) {
                    console.log(err);
                });
                /**/
            }
            
        });
    
        
        
        
    
    });
}

//Cerca l'utente richiesto
function searchUsers(bot, ctx, user) {
    console.log('Ricerca utenti');
    
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
}

module.exports.searchAds = searchAds;
module.exports.searchUsers = searchUsers;