////////////////////////////////
// MODULI E VARIABILI GLOBALI //
////////////////////////////////

//Richieste HTTP
const axios = require('axios');

//Markup del bot
const { Markup } = require('telegraf');



//////////////
// FUNZIONI //
//////////////


//Stampa gli annunci trovati
function printAds(ctx, ads) {
    
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
            reject();
        });
        
        promises.push(promise);
    }
        
    Promise.all(promises)
    .then(() => {
        ctx.reply('/continua per vedere altri annunci');
    },
          () => {
        ctx.reply('/cerca per provare con altri criteri');
    })
    .catch((err) => {
        console.log(err);
    });
    
};


//Recupera gli annunci tramite API
function getAds(ctx, url) {
        
    axios.get(url)
    .then((response) => {
        return response.data.ads;
    })
    .then((ads) => {
        printAds(ctx, ads);
    })
    .catch((err) => {
        console.log(err);
    });
    
};

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

module.exports.getAds = getAds;