// =======================
// Dichiarazione pacchetti
// =======================
var express     = require('express');
var router = express.Router();
var Annuncio =  require('../models/Annuncio.js');

// =======================
// GET /userads
// =======================
router.post('/', function (req, res) {
  var query = {};
  Annuncio.find({
    author : req.decoded.id
  }, function(err, ads) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"internal error"});
    }
    if (!ads) {
      return res.json({ success: false, message: 'No ads found for this user'});
    } else if (ads) {
      var userAds = {};
      for (index in ads){
        var ad = ads[index];
        currentAd = {};
        currentAd['id'] =ad._id;
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
        userAds['ad'+index]=currentAd;
      }
      return res.json({
        success: true,
        ads: userAds
              });
    }
  });
});

module.exports = router;
