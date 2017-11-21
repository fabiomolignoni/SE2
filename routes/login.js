// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const router = express.Router();
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utente =  require('../models/Utente.js'); // modello dell'utente
const config =  require('../config.js');

// =======================
// POST /login email, password
// =======================
router.post('/', function (req, res) {
  res.contentType('application/json');
  Utente.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err){ //findOne error
      console.log(err);
        return res.json({success: false, log:"Error while searching for the user"});
    }
    if (!user) { //User is not in the DB
        return res.json({ success: false, message: 'User not found' });
    }
    else if (user) {
      if(!req.body.password || !bcrypt.compareSync(req.body.password, user.password))  { //verify password
          return res.json({ success: false, message: 'wrong password' });
      }
      else {
        const payload = {
          id: user._id //unique identifier for the user
        };
        var token = jwt.sign(payload, config.privatekey, {
          expiresIn: '2h' // expires in 2 hours
        });
        // return the information including token as JSON
          return res.json({
          success: true,
          token: token
        });
      }
    }
  });
});

module.exports = router;
