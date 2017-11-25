const express     = require('express');
const formidable = require('formidable');
const Annuncio =  require('../models/Annuncio.js');
const advalid =  require('../modules/advalidation.js');
const router = express.Router();

// =======================
// POST /createad token, title, text, price and category
// images are optional
// =======================
router.post('/', function (req, res) {
  res.contentType('application/json');
    if(!req.fields || !advalid.verifyParameters(req.fields.title, req.fields.desc, req.fields.price, req.fields.category)){
      return res.json({success: false, log:"You must specify a valid title, desc, price and category"});
    }
    else{
      //create the ad
      var annuncio = new Annuncio();
      annuncio.author = req.decoded.id;
      annuncio.title = req.fields.title;
      annuncio.desc = req.fields.desc;
      annuncio.price = req.fields.price.replace('.', ",");;
      annuncio.category = req.fields.category.toLowerCase();
      annuncio.date = new Date(); //take current time
      var images = [];

      for(var image in req.files){ //take all the images
        console.log(image);
      var currentImage = advalid.getAdImage(req.files[image]);
        if(currentImage[0] != 'undefined'){
          images.push({data: currentImage[0], contentType: currentImage[1]});
        }
      }
      if(images.length == 0){ //if there is no valid image upload the default image
        var currentImage = advalid.getDefaultAdImage();
        images.push({data: currentImage[0], contentType: currentImage[1]});
      }
      annuncio.images = images;
      //save the ad in the DB
      annuncio.save(function(err){
        if(err){
          console.log(err);
          return res.json({success: false, log:"Unable to save the ad"});
        }
        else{
          return res.json({success: true, log:"Ad saved correctly"});
        }
      });
    }
});

module.exports = router;
