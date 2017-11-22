// =======================
// Dichiarazione pacchetti
// =======================
var express     = require('express');
var router = express.Router();
var Utente =  require('../models/Utente.js');

// =======================
// GET /userdata?email=...
// =======================
router.get('/', function (req, res) {
  var query = {};
  Utente.findOne({
    _id : req.decoded.id
  }, function(err, user) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"internal error"});
    }
    if (!user) {
      return res.json({ success: false, message: 'User not found'});
    } else if (user) {

      return res.json({
        success: true,
        name: user.name,
        surname: user.surname,
        email: user.email,
        image: 'https://messageinabot.herokuapp.com/images/profile/'+user._id,
        phone: user.phone
      });
    }
  });
});

module.exports = router;
