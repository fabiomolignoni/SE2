const express     = require('express');
const router = express.Router();
const path = require('path');
const Utente =  require(path.join(__dirname, "../", '/models/Utente.js'));
const Annuncio =  require(path.join(__dirname, "../", '/models/Annuncio.js'));

router.use('/',function(req, res, next) {
  Utente.remove({_id: req.decoded.id}, function (err) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"impossible to delete user"});
    }
  });
  Annuncio.remove({author: req.body.id}, function (err) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"impossible to delete user"});
    }
    else{
      return res.json({suceess: true, log:"user deleted"});
    }
  });
});

module.exports = router;
