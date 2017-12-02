// =======================
// packages
// =======================
const Annuncio = require('../../models/Annuncio.js')
const advalid = require('../../modules/advalidation.js')
const config = require('../../config.js')
const jwt = require('jsonwebtoken')
const formidable = require('formidable')

// =======================
// PUT /updatead
// id and token are mandatory; name, title, desc, price, category and images are optional
// =======================
var updatead = function (req, res) {
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
            if (fields) {
              if (fields.title) {
                changes['title'] = fields.title
              }
              if (fields.desc) {
                changes['desc'] = fields.desc
              }
              if (fields.price && !isNaN(parseFloat(fields.price))) {
                let prezzo = fields.price.replace(',', '.')
                changes['price'] = parseFloat(prezzo).toFixed(2)
              }
              if (fields.category && advalid.isValidCategory(fields.category)) {
                changes['category'] = (fields.category)
              }
            }
            Annuncio.findOne({_id: req.params.id, author: decoded.id}, function (err, ad) { // take ad images
              if (err) {
                console.log(err)
                return res.status(500).send({success: false, log: 'impossible to update ad'})
              } else {
                if (fields.deleteImages) {
                  var possibleDelete = fields.deleteImages.split(',')
                  var daCancellare = []
                  for (let i in possibleDelete) { // select only valid indexes
                    var index = possibleDelete[i].split('=').pop()
                    if (!isNaN(index)) {
                      daCancellare.push(index)
                    }
                  }
                  daCancellare.sort().reverse() // sort the indexes and start from bottom
                  for (let i in daCancellare) {
                    ad.images.splice(daCancellare[i], 1)
                    changes['images'] = ad.images
                  }
                }
                for (let i in files) { // add images
                  var newImage = advalid.getAdImage(files[i])
                  if (newImage[0] !== 'undefined') {
                    ad.images.push({data: newImage[0], contentType: newImage[1]})
                    changes['images'] = ad.images
                  }
                }
                // update the ad
                Annuncio.findOneAndUpdate({_id: req.params.id}, changes, {new: true}, function (err, doc) {
                  if (err) {
                    console.log(err)
                    return res.status(500).send({success: false, log: 'impossible to update ad'})
                  } else {
                    return res.status(200).send({success: true, log: 'ad updated correctly'})
                  }
                })
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

module.exports = updatead
