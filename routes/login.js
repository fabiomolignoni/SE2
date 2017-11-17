// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const router = express.Router();
const path = require('path');
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utente =  require(path.join(__dirname, "../", '/models/Utente.js')); // modello dell'utente
var config =  require(path.join(__dirname, "../", '/config.js'));

// =======================
// POST /login email, password
// =======================
router.post('/', function (req, res) {

  Utente.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err){ //findOne error
      console.log(err);
      res.json({success: false, log:"Error while searching for the user"});
    }
    if (!user) { //User is not in the DB
      res.json({ success: false, message: 'User not found' });
    }
    else if (user) {
      if(!req.body.password || !bcrypt.compareSync(req.body.password, user.password))  { //verify password
        res.json({ success: false, message: 'wrong password' });
      }
      else {
        const payload = {
          id: user._id //unique identifier for the user
        };
        var token = jwt.sign(payload, config.privatekey, {
          expiresIn: 1440 // expires in 24 hours
        });
        // return the information including token as JSON
        res.json({
          success: true,
          token: token
        });
      }
    }
  });
});

module.exports = router;
