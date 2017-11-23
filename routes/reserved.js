// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const jwt    = require('jsonwebtoken');
const formidable = require('formidable');
const updateuser = require('./updateuser.js');
const deleteuser = require('./deleteuser.js');
const userdata = require('./userdata.js');
const createad = require('./createad.js');
const config =  require('../config.js');
const router = express.Router();

//verify the token
router.use(function(req, res, next) {
  res.contentType('application/json');
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) { //if there is a token in the body
    jwt.verify(token, config.privatekey, function(err, decoded) {
      if (err){
        console.log(err);
        return res.json({ success: false, log: 'Authentication error' });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    var form = new formidable.IncomingForm();//verify if the token is in a multipart request
    form.parse(req, function (err, fields, files){
      if(fields.token){
        jwt.verify(fields.token, config.privatekey, function(err, decoded) {
          if (err){
            console.log(err);
            return res.json({ success: false, log: 'Authentication error' });
          }
          else {
            req.decoded = decoded;
            req.fields = fields;
            req.files = files;
            next();
          }
        });
      }
      else{ //if there isn't a token deny access
        return res.status(403).send({
          success: false,
          log: 'Token not found'
        });
      }
    });
  }
});
// =======================
// routes
// =======================
router.use('/updateuser',updateuser);
router.use('/userdata',userdata);
router.use('/deleteuser',deleteuser);
router.use('/createad',createad);

module.exports = router;
