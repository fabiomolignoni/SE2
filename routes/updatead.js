// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const router = express.Router();
const Annuncio =  require('../models/Annuncio.js');
const advalid =  require('../modules/advalidation.js');
const bcrypt = require('bcrypt');
const validator = require('validator');

// =======================
// POST /updatead
// id is mandatory; name, title, desc, price, category and images are optional
// =======================
router.post('/', function (req, res) {
  var changes ={}; //json with changes
  if(req.fields){
    if(req.fields.title){
      changes['title'] = req.fields.title;
    }
    if(req.fields.desc){
      changes['desc'] = req.fields.desc;
    }
    if(req.fields.price && validator.isCurrency(req.fields.price.replace(',', "."))){
      changes['price'] = req.fields.price.replace(',', ".");
    }
    if(req.fields.category && advalid.isValidCategory(category)){
      changes['category'] = (req.fields.category);
    }
  }
  var currentImages = [];
  Annuncio.findOne({_id: req.fields.id}).exec().then(function(ad){
    if(req.fields.deleteImages || req.files){
      currentImages = ad.images.slice();
      if(req.fields.deleteImages){
        for(var i = 0; i<currentImages.length; i++){ //remove images
          var currentLink = 'https://messageinabot.herokuapp.com/images/ad/'+ad._id+'_'+i;
          var index = req.fields.deleteImages.indexOf(currentLink);
          if(index >-1){
            i--;
            currentImages.splice(index, 1); //remove the element from array
          }
        }
      }
      for(var image in req.files){ //add images
        var newImage = advalid.getAdImage(req.files[image]);
        if(newImage[0] != 'undefined'){
          currentImages.push({data: newImage[0], contentType: newImage[1]});
        }
      }
      if(currentImages.length == 0){ //if there is no valid image upload the default image
        var image = advalid.getDefaultAdImage();
        currentImages.push({data: image[0], contentType: image[1]});
      }
      console.log(currentImages);
      changes['images'] = currentImages;

    }
    Annuncio.findOneAndUpdate({_id:req.fields.id},changes,{new: true},function(err, doc){ //update data with the json
      if(err){
        console.log(err);
        return res.json({success: false, log: "impossible to update ad"});
      }
      else{
        return res.json({success: true, log: "ad updated correctly"});
      }
    });
  });
});

  module.exports = router;
