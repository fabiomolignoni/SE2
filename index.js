// =======================
// Dichiarazione pacchetti
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

// =======================
// configurazione parametri
// =======================
var port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// =======================
// routes
// =======================
app.get('/', function(req, res) {
    res.send('prova funzionamento');
});

// =======================
// avvio del server
// =======================
app.listen(port);
console.log('Server avviato sulla porta:' + port);
