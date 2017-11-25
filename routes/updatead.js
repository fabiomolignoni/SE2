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

  Annuncio.findOneAndUpdate({_id:req.fields.id},changes,{new: true},function(err, doc){ //update data with the json
    if(err){
      console.log(err);
      return res.json({success: false, log: "impossible to update ad"});
    }
    else{
      return res.json({success: true, log: "ad update correctly"});
    }
  });
});

module.exports = router;
