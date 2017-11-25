// =======================
// Dichiarazione pacchetti
// =======================
var express     = require('express');
var router = express.Router();
var Annuncio =  require('../models/Annuncio.js');

// =======================
// GET /userads
// =======================
function adsDateSort(a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}
router.get('/', function (req, res) {
  var query = {};
  Annuncio.find({
  }, function(err, ads) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"internal error"});
    }
    if (!ads) {
      return res.json({ success: false, message: 'No ads found for this user'});
    } else if (ads) {
      var from = 0;
      if(req.query.from && !isNaN(parseInt(req.query.from))){ //if from parameter is valid
        from = parseInt(req.query.from);
      }
      var to = ads.length-1;
      if(req.query.to && !isNaN(parseInt(req.query.to))&& from <= parseInt(req.query.to)){ //if to parameter is valid
        to = parseInt(req.query.to);
      }
      var userAds = {};
      ads.sort(adsDateSort);
      for (index in ads){
        if(index>=from && index<=to){ //send ad only if exists
          var ad = ads[index];
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
          userAds['ad'+index]=currentAd;
        }
      }
      return res.json({
        success: true,
        ads: userAds
      });
    }
  });
});

module.exports = router;
