// =======================
// packages
// =======================
const Annuncio = require('../../models/Annuncio.js')
const advalid = require('../../modules/advalidation.js')
const config = require('../../config.js')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')

// =======================
// POST /ad token, title, text, price and category
// images are optional
// =======================
var createad = function (req, res) {
  res.contentType('application/json')
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    return res.status(400).send({ success: false, log: 'send multipart request' })
  }
  var form = new formidable.IncomingForm()
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.log(err)
      return res.status(400).send({ success: false, log: 'Error handling multipart data' })
    } else {
      if (fields.token) {
        jwt.verify(fields.token, config.privatekey, function (err, decoded) {
          if (err) {
            console.log(err)
            return res.status(403).send({ success: false, log: 'Authentication error' })
          } else {
            if (!fields || !advalid.verifyParameters(fields.title, fields.desc, fields.price, fields.category)) {
              return res.status(400).send({success: false, log: 'You must specify a valid title, desc, price and category'})
            } else {
              // create the ad
              var annuncio = new Annuncio()
              annuncio.author = decoded.id
              annuncio.title = fields.title
              annuncio.desc = fields.desc
              let prezzo = fields.price.replace(',', '.')
              annuncio.price = parseFloat(prezzo).toFixed(2)
              annuncio.category = fields.category.toLowerCase()
              annuncio.date = new Date() // take current time
              var images = []
              for (var image in files) { // take all the images
                var currentImage = advalid.getAdImage(files[image])
                if (currentImage[0] !== 'undefined') {
                  images.push({data: currentImage[0], contentType: currentImage[1]})
                }
              }
              annuncio.images = images
              // save the ad in the DB
              annuncio.save(function (err, ad) {
                if (err) {
                  console.log(err)
                  return res.status(500).send({success: false, log: 'Unable to save the ad'})
                } else {
                  return res.status(200).send({success: true, log: 'Ad saved correctly', id: ad._id})
                }
              })
            }
          }
        })
      } else {
        return res.status(403).send({ success: false, log: 'token not found' })
      }
    }
  })
}

module.exports = createad
