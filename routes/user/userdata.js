// =======================
// Packages
// =======================
var Utente = require('../../models/Utente.js')

// =======================
// GET /user/<id>
// =======================
var userData = function (req, res) {
  res.contentType('application/json')
  Utente.findOne({
    _id: req.params.id
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

module.exports = userData
