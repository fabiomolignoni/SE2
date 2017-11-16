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
var config = require('./config'); // file di configurazione
var signup = require('./routes/signup.js');

var port = process.env.PORT || 8080;

mongoose.connect(config.database, {
   useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// =======================
// routes
// =======================
app.use('/signup', signup);

// =======================
// avvio del server
// =======================
app.listen(port);
console.log('Server avviato sulla porta:' + port);
