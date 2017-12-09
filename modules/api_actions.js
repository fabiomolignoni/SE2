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
    
    return new Promise((resolve, reject) => {        
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
                        ctx.replyWithMarkdown('📌 *' + ad.title + '*\n' +
                                              '_' + ad.desc + '_\n' +
                                              '\n' +
                                              'Prezzo: ' + ad.price + '\n' +
                                              'Categoria: ' + ad.category + '\n' +
                                              'Data: ' + new Date(ad.date) + '\n',
                                              Markup.inlineKeyboard([Markup.callbackButton('Contatta ' + author.name + ' ' + author.surname, author.id)]).extra()
                                             )
                        .then(() => resolve());
                    }).catch((err) => console.log(err));

                });

                promises.push(promise);
            });

        } else {
            var promise = new Promise((resolve, reject) => {
                reject();
            });

            promises.push(promise);
        }

        Promise.all(promises)
        .then(() => ctx.reply('/continua per vedere altri annunci'),
              () => ctx.reply('Spiacente, nessun annuncio trovato.'))
        .then(() => resolve())
        .catch((err) => console.log(err));        
    });
        
};


//Recupera gli annunci tramite API
function getAds(ctx, url) {
        
    return new Promise((resolve, reject) => {
        //RICHIESTA ANNUNCI
        axios.get(url)
        .then((response) => {
            return response.data.ads;
        })
        .then((ads) => {
            printAds(ctx, ads)
            .then(() => resolve());
        })
        .catch((err) => {
            console.log(err);
        });
    });    
    
};


//Cerca l'utente richiesto
function getUser(ctx, url) {    
    
    return new Promise((resolve, reject) => {
        //RICHIESTA UTENTI
        axios.get(url)
        .then(function (response) {
            var info = response.data;

            ctx.replyWithMarkdown('*' + info.name + ' ' + info.surname + '*\n' +
                                  '✉️ ' + info.email + '\n' +
                                  (info.phone ? ('☎️ ' + info.phone + '\n') : '')
                                 )
            .then(() => resolve()).catch((err) => console.log(err));
        })
        .catch(function (err) {
            console.log(err);
        });
    })
    
}


module.exports.getAds = getAds;
module.exports.getUser = getUser;