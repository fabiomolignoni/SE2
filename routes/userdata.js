var express     = require('express');
var router = express.Router();
var path = require('path');
var Utente =  require(path.join(__dirname, "../", '/models/Utente.js'));
var userdata = require('./userdata.js');

// =======================
// GET /userdata?email=...
// =======================
router.get('/', function (req, res) {
  Utente.findOne({ //search user
    email : req.query.email
  }, function(err, user) {
    if (err){
      console.log(err);
      res.json({success: false, log:"internal error"});
    }
    if (!user) {
      res.json({ success: false, message: 'User not found'});
    } else if (user) { //send back data
        res.json({
          success: true,
          identification: user.identification,
          email: user.email,
          contentType: user.image.contentType,
          image: user.image.data,
          phone: user.phone
        });
    }
  });
});

module.exports = router;
