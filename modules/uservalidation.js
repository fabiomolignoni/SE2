const fs    = require('file-system');
const validator = require('validator');
const path = require('path');

//returns true if name, surname, email and passowrd exist and the email is valid
function verifyParameters(name, surname, email, password){
  if(!name || !surname || !email ||!password ||!validator.isEmail(email)){
    return false;
  }
  else{
    return true;
  }
}

//returns the number if it's valid, -1 otherwise
function getPhone(phone){
  if(phone){
    if(typeof phone=='number'){
      phone = phone.toString();
    }
    phone = phone.replace(/\D/g,''); //delete all non-numeric character
    if(validator.isMobilePhone(phone,'it-IT')){ //verify if the phone number is valid
      return phone;
    }
    else{
      return "-1";
    }
  }
  else{
    return "-1";
  }
}

//if the input it's an image returns an array: array[0]=image_file array[1]='image/<extension>'
function getUserImage(image){
  var data;
  var contentType;
  if(image && image.name.match(/.(jpg|jpeg|png|gif)$/i)){
    data = fs.readFileSync(image.path);
    contentType ='image/'+ image.name.split('.').pop();
  }
  else{
    data = undefined;
    contentType = undefined;
  }
  return[data, contentType];
}

module.exports.verifyParameters = verifyParameters;
module.exports.getPhone = getPhone;
module.exports.getUserImage = getUserImage;
