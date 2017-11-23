const express     = require('express');
const formidable = require('formidable');
const Annuncio =  require('../models/Annuncio.js');
const advalid =  require('../modules/advalidation.js');
const router = express.Router();

// =======================
// GET /createad token, title, text, price and category
// images are optional
// =======================
var categorie = ["libri", "appunti", "stage/lavoro", "ripetizioni","eventi"];
router.post('/', function (req, res) {
  res.contentType('application/json');
    if(!advalid.verifyParameters(req.fields.title, req.fields.text, req.fields.price, req.fields.category)){
      return res.json({success: false, log:"You must specify a valid title, text, price and category"});
    }
    else{
      //create the ad
      var annuncio = new Annuncio();
      annuncio.author = req.decoded.id;
      annuncio.title = req.fields.title;
      annuncio.text = req.fields.text;
      annuncio.price = req.fields.price;
      var category = req.fields.category.toLowerCase();
      if (categorie.indexOf(category) > -1){
        annuncio.category = category;
      }
      else{
        return res.json({success: false, log:"Category is not valid"});
      }
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
