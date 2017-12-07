// =======================
// Dichiarazione pacchetti
// =======================
var express = require('express')
var elasticlunr = require('elasticlunr')
var router = express.Router()
var Annuncio = require('../../models/Annuncio.js')
var advalid = require('../../modules/advalidation.js')

function adsDateSort (a, b) {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
}

// =======================
// GET /getads category, gratis, searchString, from, to
// default: category=none, gratis=false, q = none, limit = 0, offset = #ads,
// fromlast = false, lessThan = None, user = None, title = none
// =======================
router.get('/', function (req, res) {
  var query = {} // query for the DB
  if (req.query.category && advalid.isValidCategory(req.query.category)) { // verify the category
    query['category'] = req.query.category.toLowerCase()
  }
  if (req.query.user) {
    query['author'] = req.query.user
  }
  if (req.query.title) {
    query['title'] = req.query.title
  }
  if (req.query.lessThan && !isNaN(parseFloat(req.query.lessThan))) {
    query['price'] = {$lt: parseFloat(req.query.lessThan)}
  }
  Annuncio.find(query, function (err, ads) {
    if (err) {
      console.log(err)
      return res.json({success: false, log: 'internal error'})
    }
    if (!ads) {
      return res.json({success: false, message: 'No ads found'})
    } else if (ads) {
      var from = 0
      if (req.query.offset && !isNaN(parseInt(req.query.offset)) && parseInt(req.query.offset) >= 0) {  // if from parameter is valid
        from = parseInt(req.query.offset)
      }
      var to = ads.length
      if (req.query.limit && !isNaN(parseInt(req.query.limit)) && from + parseInt(req.query.limit) + 1 <= ads.length) { // if to parameter is valid
        to = from + parseInt(req.query.limit) + 1
      }
      var adsElements = [] // ads that will be send back
      if (req.query.q) {
        var index = elasticlunr(function () { // define search parameters
          this.addField('title')
          this.addField('desc')
          this.setRef('index')
        })
        for (let i in ads) { // add all the ads in the "searching box"
          var adToInsert = {
            title: ads[i].title,
            desc: ads[i].desc,
            index: i
          }
          index.addDoc(adToInsert)
        }
        var response = index.search(req.query.q, { // define weight of the parameters and filter the ads
          title: {boost: 2},
          desc: {boost: 1}
        })
        console.log(response.length)
        for (let k = from; k < to; k++) {
          if (typeof response[k] !== 'undefined') {
            var ad = ads[response[k].ref]
            adsElements.push(ad)
          }
        }
      } else {
        adsElements = ads
        adsElements = adsElements.slice(from, to)
      }
      if (req.query.fromLast === 'true') { // reorder from last created
        adsElements.sort(adsDateSort)
      }

      var returnAds = []
      for (let i in adsElements) {
        var actualAd = {}
        actualAd.title = adsElements[i].title
        actualAd.desc = adsElements[i].desc
        actualAd.price = adsElements[i].price
        actualAd.category = adsElements[i].category
        actualAd.date = adsElements[i].date
        actualAd.id = adsElements[i].id
        actualAd.author = 'https://messageinabot.herokuapp.com/users/' + adsElements[i].author
        var images = []
        for (var k = 0; k < adsElements[i].images.length; k++) { // add all images
          images.push('https://messageinabot.herokuapp.com/ads/' + adsElements[i]._id + '/images?index=' + k)
        }
        if (images.length === 0) { // if there is no valid image send the default image
          images.push('https://messageinabot.herokuapp.com/ads/' + adsElements[i]._id + '/images?index=0')
        }
        actualAd.images = images
        returnAds.push(actualAd)
      }
      return res.status(200).send({success: true, ads: returnAds})
    }
  })
})

module.exports = router
