// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const fs    = require('file-system');
const path = require('path');
const formidable = require('formidable');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Utente =  require(path.join(__dirname, "../", '/models/Utente.js')); // modello dell'utente
const router = express.Router();

// =======================
// POST /signup name, surname, email, password
// image and phone are optional
// =======================
router.post('/', function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    //if some fundamental parameters (name, surname email, password) are missing
    //or if the email address is invalid  success = false
    if(!fields.name || !fields.surname || !fields.email ||!fields.password ||!validator.isEmail(fields.email)){
      res.json({success: false, log:"You must specify a valid name, surname, email and password"});
    }
    else{
      //create the user
      var utente = new Utente();
      utente.identification.name = fields.name;
      utente.identification.surname = fields.surname;
      utente.email = fields.email;
      utente.password = bcrypt.hashSync(fields.password, 10);

      //phone = -1 if there isn't or if is invalid
      if(fields.phone){
        var phone = fields.phone.replace(/\D/g,''); //delete all non-numeric character
        if(validator.isMobilePhone(phone,'it-IT')) //verify if the phone number is valid
          utente.phone = fields.phone;
        else
        utente.phone = -1;
      }
      else
        utente.phone = -1;

      //image = default.png if there isn't an image to upload or if the file is not in a supported format
      if(files.image && files.image.name.match(/.(jpg|jpeg|png|gif)$/i)){
        utente.image.data = fs.readFileSync(files.image.path).toString('base64');
        utente.image.contentType = 'image/'+files.image.name.split('.').pop();
      }
      else{
        utente.image.data = fs.readFileSync(path.join(__dirname, "../", '/images/default.png')).toString('base64');
        utente.image.contentType = 'image/png';
      }
      //save the user in the DB
      utente.save(function(err){
        if(err){
          console.log(err);
          res.json({success: false, log:"Unable to save user"});
        }
        else
          res.json({success: true, log:"User saved correctly"});
      });
    }
  });
});

module.exports = router;
