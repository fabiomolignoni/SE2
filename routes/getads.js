// =======================
// Dichiarazione pacchetti
// =======================
var express     = require('express');
var elasticlunr     = require('elasticlunr');
var router = express.Router();
var Annuncio =  require('../models/Annuncio.js');
var advalid =  require('../modules/advalidation.js');

// =======================
// GET /getads category, gratis, searchString, from, to
//default: category=none, gratis=false, searchString="", from = 0, to = #ads
// =======================
router.get('/', function (req, res) {
  var query = {}; //query for the DB
  if(req.query.category && advalid.isValidCategory(req.query.category)){ //verify the category
    query['category'] = req.query.category.toLowerCase();
  }
  if(req.query.gratis == 'true'){ //if gratis price needs to be 0
    query['price'] = "0.00";
  }
  Annuncio.find(query, function(err, ads) {
    if (err){
      console.log(err);
      return res.json({success: false, log:"internal error"});
    }

    if (!ads) {
      return res.json({ success: false, message: 'No ads found'});
    }
    else if (ads) {
      var from = 0;
      if(req.query.from && !isNaN(parseInt(req.query.from))){ //if from parameter is valid
        from = parseInt(req.query.from);
      }
      var to = ads.length-1;
      if(req.query.to && !isNaN(parseInt(req.query.to))&& from <= parseInt(req.query.to)){ //if to parameter is valid
        to = parseInt(req.query.to);
      }
      var index = elasticlunr(function () { //define search parameters
        this.addField('title');
        this.addField('desc');
        this.setRef('index');
      });
      for(i in ads){ //add all the ads in the "searching box"
        var adToInsert ={
          title: ads[i].title,
          desc: ads[i].desc,
          index: i
        }
        index.addDoc(adToInsert);
      }
      var searchString = req.query.searchString;
      if(typeof searchString == 'undefined'){ //default search string = ""
        searchString = "";
      }
      var response = index.search(searchString,{ //define weight of the parameters and filter the ads
        title: {boost: 2},
        desc: {boost: 1}
      });
      var returnAds ={}; //ads that will be send back
      var currentAd ={};
      var numberAd = 0; //number of ads that will be sent back
      for (index in response){
        if(index>=from && index<=to){ //send ad only if exists
          //create json ad
          var ad = ads[response[index].ref];
          currentAd = {};
          currentAd['title'] =ad.title;
          currentAd['desc'] =ad.desc;
          currentAd['price'] =ad.price;
          currentAd['date'] =ad.date;
          currentAd['id'] =ad._id;
          currentAd['category'] =ad.category;
          var images = [];
          for (var i =0; i <ad.images.length; i+=1){
            images.push('https://messageinabot.herokuapp.com/images/ad/'+ad._id+'_'+i);
          }
          currentAd['images']=images;
          returnAds['ad'+numberAd]=currentAd;
          numberAd += 1;
        }
      }
    return res.json({
      success: true,
      ads: returnAds
    });
  }
});
});

module.exports = router;
