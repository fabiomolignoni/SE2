// =======================
// packages
// =======================
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const telegrambot = require('./modules/telegrambot.js')
const cors = require('cors')

// =======================
// parameters
// =======================
var config = require('./config.js')
var signup = require('./routes/signup.js')
var login = require('./routes/login.js')
var reserved = require('./routes/reserved.js')
var adroutes = require('./routes/ad/adroutes.js')

var port = process.env.PORT || 8080

mongoose.connect(config.database, {
  useMongoClient: true
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

// =======================
// routes
// =======================
app.use('/signup', signup)
app.use('/login', login)
app.use('/reserved', reserved)
app.use('/ads', adroutes)

// =======================
// start the server and the bot
// =======================
// telegrambot.launchbot()
app.listen(port)
console.log('Server avviato sulla porta:' + port)
