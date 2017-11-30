// =======================
// Dichiarazione pacchetti
// =======================
const Annuncio = require('../../models/Annuncio.js')
const fs = require('file-system')

// =======================
// GET /ad/<id>?index=val
// =======================
var adimages = function (req, res) {
  var index = parseInt(req.query.index)
  if (isNaN(index)) {
    return res.status(403).end('invalid index')
  }
  Annuncio.findOne({ // search ad
    _id: req.params.id
  }, function (err, ad) {
    if (err) {
      console.log(err)
      return res.status(500).end('internal error')
    }
    if (!ad) {
      return res.status(403).end('no ad found')
    } else if (ad) {
      if (ad.images[index]) {
        res.contentType(ad.images[index].contentType)
        res.send(ad.images[index].data)
      } else {
        res.contentType('image/jpg') // if there is not an image in the DB return the default image
        res.send(fs.readFileSync('./images/ad.jpg'))
      }
    }
  })
}

module.exports = adimages
