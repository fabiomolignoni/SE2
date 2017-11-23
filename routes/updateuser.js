// =======================
// Dichiarazione pacchetti
// =======================
const express     = require('express');
const router = express.Router();
const Utente =  require('../models/Utente.js');
const uservalid =  require('../modules/uservalidation.js');
const bcrypt = require('bcrypt');
const validator = require('validator');

// =======================
// POST /updateuser
// name, surname, email, password, image and phone are optional
// =======================
router.post('/', function (req, res) {
  var changes ={}; //json with changes
  if(req.fields.name){
    changes['name'] = req.fields.name;
  }
  if(req.fields.surname){
    changes['surname'] = req.fields.surname;
  }
  if(req.fields.email && validator.isEmail(req.fields.email)){
    changes['email'] = req.fields.email;
  }
  if(req.fields.password){
    changes['password'] = bcrypt.hashSync(req.fields.password, 10);
  }
  if(req.fields.phone){
    var phone = uservalid.getPhone(req.fields.phone);
    if(phone != "-1")
      changes['phone'] =phone;
  }
  if(req.files.image){
    var image = uservalid.getUserImage(req.files.image);
    changes['image.data'] = image[0];
    changes['image.contentType'] = image[1];
  }
  Utente.findOneAndUpdate({_id:req.decoded.id},changes,{new: true},function(err, doc){ //update data with the json
    if(err){
      console.log(err);
      return res.json({success: false, log: "impossible to update user"});
    }
    else{
      return res.json({success: true, log: "user update correctly"});
    }
  });
});

module.exports = router;
