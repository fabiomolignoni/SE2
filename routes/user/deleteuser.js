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
        if (decoded.id !== req.params.id) {
          return res.status(403).send({ success: false, log: 'You can modify only your data' })
        }
        Utente.remove({_id: decoded.id}, function (err) {
          if (err) {
            console.log(err)
            return res.status(500).send({success: false, log: 'impossible to delete user'})
          }
        })
        Annuncio.remove({author: decoded.id}, function (err) {
          if (err) {
            console.log(err)
            return res.status(500).send({success: false, log: 'impossible to delete user'})
          } else {
            return res.status(200).send({sucess: true, log: 'user deleted'})
          }
        })
      }
    })
  } else {
    return res.status(403).send({ success: false, log: 'token not found' })
  }
}

module.exports = deleteUser
