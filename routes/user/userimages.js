// =======================
// Packages
// =======================
const Utente = require('../../models/Utente.js')

// =======================
// GET /users/<id>/image
// =======================
var userimages = function (req, res) {
  Utente.findOne({ // search ad
    _id: req.params.id
  }, function (err, user) {
    if (err) {
      console.log(err)
      return res.status(500).end('internal error')
    }
    if (!user) {
      return res.status(403).end('no user found')
    } else if (user) {
      res.contentType(user.image.contentType)
      res.send(user.image.data)
    }
  })
}

module.exports = userimages
