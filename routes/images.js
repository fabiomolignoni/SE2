// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const router = express.Router();
const Utente =  require('../models/Utente.js');
const Annuncio =  require('../models/Annuncio.js');
const fs    = require('file-system');

// =======================
// GET /images/<id>
// =======================
router.get('/profile/:id', function (req, res) {
  var id = req.params.id;
  Utente.findOne({ //search user
    _id : id
  }, function(err, user) {
    if (err){
      console.log(err);
      res.contentType('application/json');
      return res.json({sucess: false, log: "image not found"});
    }
    if (!user) {
      res.contentType('application/json');
      return res.json({sucess: false, log: "unable to find user"});
    } else if (user) {
      if(typeof user.image.contentType != 'undefined'){
        res.contentType(user.image.contentType);
        res.send(user.image.data);
      }
      else{
        res.contentType('image/png'); //if there is not an image in the DB return the default image
        res.send(fs.readFileSync('./images/default.png'));
      }
    }
  });
});

router.get('/ad/:id', function (req, res) {
  var index = req.params.id.split('_').pop();
  var id = req.params.id.replace('_'+index, "");
  Annuncio.findOne({ //search ad
    _id : id
  }, function(err, ad) {
    if (err){
      console.log(err);
      res.contentType('application/json');
      return res.json({sucess: false, log: "image not found"});
    }
    if (!ad) {
      res.contentType('application/json');
      return res.json({sucess: false, log: "unable to find ad"});
    } else if (ad) {
      if(ad.images[index]){
        console.log(ad.images[index]);
        res.contentType(ad.images[index].contentType);
        res.send(ad.images[index].data);
      }
      else{
        res.contentType('image/jpg'); //if there is not an image in the DB return the default image
        res.send(fs.readFileSync('./images/ad.jpg'));
      }
    }
  });
});

module.exports = router;
