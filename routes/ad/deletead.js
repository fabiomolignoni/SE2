// =======================
// packages
// =======================
const Annuncio = require('../../models/Annuncio.js')
const jwt = require('jsonwebtoken')
const config = require('../../config.js')

// =======================
// DELETE /ad token, id
// =======================
var deletead = function (req, res) {
  res.contentType('application/json')
  if (req.query.token) { // verify the token
    jwt.verify(req.query.token, config.privatekey, function (err, decoded) {
      if (err) {
        console.log(err)
        return res.status(403).send({ success: false, log: 'Authentication error' })
      } else {
        Annuncio.remove({_id: req.params.id}, function (err) {
          if (err) {
            console.log(err)
            return res.status(500).send({success: false, log: 'impossible to delete ad'})
          } else {
            return res.status(200).send({suceess: true, log: 'ad deleted'})
          }
        })
      }
    })
  } else {
    return res.status(403).send({ success: false, log: 'token not found' })
  }
}

module.exports = deletead
