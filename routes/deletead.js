const express     = require('express');
const router = express.Router();
const path = require('path');
const Annuncio =  require(path.join(__dirname, "../", '/models/Annuncio.js'));

router.post('/', function (req, res) {
  Annuncio.remove({_id: req.body.id}, function (err) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"impossible to delete ad"});
    }
    else{
      return res.json({suceess: true, log:"ad deleted"});
    }
  });
});

module.exports = router;
