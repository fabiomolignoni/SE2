// =======================
// packages
// =======================
const formidable = require('formidable')
const bcrypt = require('bcrypt')
const Utente = require('../../models/Utente.js') // modello dell'utente
const uservalid = require('../../modules/uservalidation.js')

// =======================
// POST /signup name, surname, email, password
// image and phone are optional
// =======================
var signup = function (req, res) {
  res.contentType('application/json')
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    return res.status(400).send({ success: false, log: 'send multipart request' })
  }
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      return res.json({success: 'false', log: 'error parsing multipart'})
    }
    // if some fundamental parameters (name, surname email, password) are missing
    // or if the email address is invalid  success = false
    if (!uservalid.verifyParameters(fields.name, fields.surname, fields.email, fields.password)) {
      return res.json({success: false, log: 'You must specify a valid name, surname, email and password'})
    } else {
      // create the user
      var utente = new Utente()
      utente.name = fields.name
      utente.surname = fields.surname
      utente.email = fields.email
      utente.password = bcrypt.hashSync(fields.password, 10)
      var phone = uservalid.getPhone(fields.phone)
      if (phone !== '-1') {
        utente.phone = phone
      }
      var image
      if (files.image) {
        image = uservalid.getUserImage(files.image)
      } else {
        image = uservalid.getUserImage()
      }
      if (typeof image[0] !== 'undefined') {
        utente.image.data = image[0]
        utente.image.contentType = image[1]
      }
      // save the user in the DB
      utente.save(function (err) {
        if (err) {
          console.log(err)
          return res.json({success: false, log: 'Unable to save user'})
        } else {
          return res.json({success: true, log: 'User saved correctly'})
        }
      })
    }
  })
}

module.exports = signup
