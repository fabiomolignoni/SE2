// =======================
// Packages
// =======================
const Utente = require('../../models/Utente.js')
const config = require('../../config.js')
const jwt = require('jsonwebtoken')

// =======================
// GET /users?token=
// =======================
var userByToken = function (req, res) {
  res.contentType('application/json')
  jwt.verify(req.query.token, config.privatekey, function (err, decoded) {
    if (err) {
      console.log(err)
      return res.status(403).send({ success: false, log: 'Authentication error' })
    } else {
      Utente.findOne({
        _id: decoded.id
      }, function (err, user) {
        if (err) {
          console.log(err)
          return res.status(500).send({success: false, log: 'internal error'})
        }
        if (!user) {
          return res.status(403).send({success: false, message: 'User not found'})
        } else if (user) {
          return res.status(200).send({
            success: true,
            id: user._id,
            name: user.name,
            surname: user.surname,
            email: user.email,
            image: 'https://messageinabot.herokuapp.com/users/' + user._id + '/image',
            phone: user.phone
          })
        }
      })
    }
  })
}

module.exports = userByToken
