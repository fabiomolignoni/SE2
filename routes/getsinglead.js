// =======================
// Dichiarazione pacchetti
// =======================
var express     = require('express');
var elasticlunr     = require('elasticlunr');
var router = express.Router();
var Annuncio =  require('../models/Annuncio.js');
var Utente =  require('../models/Utente.js');
var advalid =  require('../modules/advalidation.js');

// =======================
// GET /getsinglead id
// =======================
router.get('/', function (req, res) {
  Annuncio.findOne({_id: req.query.id}, function(err, ad) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"internal error"});
    }
    if (!ad) {
      return res.json({ success: false, message: 'Ad not found'});
    }
    //create ad json
    else if (ad) {
      currentAd = {};
      currentAd['title'] =ad.title;
      currentAd['desc'] =ad.desc;
      currentAd['price'] =ad.price;
      currentAd['date'] =ad.date;
      currentAd['category'] =ad.category;
      var images = [];
      for (var i =0; i <ad.images.length; i+=1){
        images.push('https://messageinabot.herokuapp.com/images/ad/'+ad._id+'_'+i);
      }
      currentAd['images']=images;
      //create user json
      var currentUser = {};
      Utente.findOne({
        _id : ad.author
      }, function(err, user) {
        if (err){
          console.log(err);
          return res.json({success: false, log:"internal error"});
        }
        if (!user) {
          return res.json({ success: false, message: 'User not found'});
        }
        else if (user) {

            currentUser['name'] = user.name;
            currentUser['surname'] = user.surname;
            currentUser['email'] = user.email;
            currentUser['image'] = 'https://messageinabot.herokuapp.com/images/profile/'+user._id;
            currentUser['phone'] = user.phone;

            return res.json({
              success: true,
              ad: currentAd,
              user: currentUser
            });
        }
      });
    }
  });
});

module.exports = router;
