// =======================
// packages
// =======================
const jwt = require('jsonwebtoken')
const config = require('../../config.js')
const Utente = require('../../models/Utente.js')
const Annuncio = require('../../models/Annuncio.js')

// =======================
// DELETE /user token, id
// =======================
var deleteUser = function (req, res, next) {
  res.contentType('application/json')
  if (req.query.token) { // verify the token
    jwt.verify(req.query.token, config.privatekey, function (err, decoded) {
      if (err) {
        console.log(err)
        return res.status(403).send({ success: false, log: 'Authentication error' })
      } else {
        Utente.remove({_id: req.params.id}, function (err) {
          if (err) {
            console.log(err)
            return res.status(500).send({success: false, log: 'impossible to delete user'})
          }
        })
        Annuncio.remove({author: req.params.id}, function (err) {
          if (err) {
            console.log(err)
            return res.status(500).send({success: false, log: 'impossible to delete user'})
          } else {
            return res.status(200).send({suceess: true, log: 'user deleted'})
          }
        })
      }
    })
  } else {
    return res.status(403).send({ success: false, log: 'token not found' })
  }
}

module.exports = deleteUser
