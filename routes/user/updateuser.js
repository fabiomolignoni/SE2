// =======================
// Packages
// =======================
const Utente = require('../../models/Utente.js')
const uservalid = require('../../modules/uservalidation.js')
const bcrypt = require('bcrypt')
const validator = require('validator')
const config = require('../../config.js')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')

// =======================
// PUT /updateuser
// name, surname, email, password, image and phone are optional
// =======================
var updateUser = function (req, res) {
  res.contentType('application/json')
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    return res.status(400).send({ success: false, log: 'send multipart request' })
  }
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      return res.status(403).send({ success: false, log: 'Error handling multipart data' })
    } else {
      if (fields.token) { // verify token
        jwt.verify(fields.token, config.privatekey, function (err, decoded) {
          if (err) {
            console.log(err)
            return res.status(403).send({ success: false, log: 'Authentication error' })
          } else {
            if (decoded.id !== req.params.id) {
              return res.status(403).send({ success: false, log: 'You can modify only your data' })
            }
            var changes = {} // json with changes
            if (fields.name) {
              changes['name'] = fields.name
            }
            if (fields.surname) {
              changes['surname'] = fields.surname
            }
            if (fields.email && validator.isEmail(fields.email)) {
              changes['email'] = fields.email
            }
            if (fields.password) {
              changes['password'] = bcrypt.hashSync(fields.password, 10)
            }
            if (fields.phone) {
              var phone = uservalid.getPhone(fields.phone)
              if (phone !== '-1') {
                changes['phone'] = phone
              }
            }
            if (files.image) {
              var image = uservalid.getUserImage(files.image)
              changes['image.data'] = image[0]
              changes['image.contentType'] = image[1]
            }
            // update data with the json
            Utente.findOneAndUpdate({_id: decoded.id}, changes, {new: true}, function (err, doc) {
              if (err) {
                console.log(err)
                return res.json({success: false, log: 'impossible to update user'})
              } else {
                return res.json({success: true, log: 'user update correctly'})
              }
            })
          }
        })
      } else {
        return res.status(403).send({ success: false, log: 'token not found' })
      }
    }
  })
}

module.exports = updateUser
