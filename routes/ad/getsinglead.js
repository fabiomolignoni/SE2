// =======================
// Dichiarazione pacchetti
// =======================
var Annuncio = require('../../models/Annuncio.js')

// =======================
// GET /ads/<id>
// =======================
var getsinglead = function (req, res) {
  res.contentType('application/json')
  Annuncio.findOne({_id: req.params.id}, function (err, ad) {
    if (err) {
      console.log(err)
      return res.status(500).send({success: false, log: 'internal error'})
    }
    if (!ad) {
      res.status(403).send({success: false, message: 'Ad not found'})
    } else if (ad) { // create ad json
      var currentAd = {}
      currentAd['title'] = ad.title
      currentAd['desc'] = ad.desc
      currentAd['price'] = ad.price
      currentAd['date'] = ad.date
      currentAd['category'] = ad.category
      var images = []
      for (var i = 0; i < ad.images.length; i++) {
        images.push('https://messageinabot.herokuapp.com/ads/' + req.params.id + '/images?index=' + i)
      }
      if (images.length === 0) { // if there is no valid image send the default image
        images.push('https://messageinabot.herokuapp.com/ads/' + req.params.id + '/images?index=0')
      }
      currentAd['images'] = images
      return res.status(200).send({
        success: true,
        ad: currentAd,
        user: 'https://messageinabot.herokuapp.com/users/' + ad.author
      })
    }
  })
}

module.exports = getsinglead
