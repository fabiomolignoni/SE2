const fs = require('file-system')

var categorie = ['libri', 'appunti', 'stage/lavoro', 'ripetizioni', 'eventi']

function isValidCategory (category) {
  return categorie.indexOf(category.toLowerCase()) !== -1
}

function verifyParameters (title, text, price, category) {
  if (!title || !text || !price || !category || !price || isNaN(parseFloat(price)) || !isValidCategory(category)) {
    return false
  } else {
    return true
  }
}
// if the input it's an image returns an array: array[0]=image_file array[1]='image/<extension>'
function getAdImage (image) {
  var data
  var contentType
  if (image && image.name.match(/.(jpg|jpeg|png|gif)$/i)) {
    data = fs.readFileSync(image.path)
    contentType = 'image/' + image.name.split('.').pop()
  } else {
    data = undefined
    contentType = undefined
  }
  return [data, contentType]
}

function getDefaultAdImage () {
  return [fs.readFileSync('./images/ad.jpg'), 'image/jpg']
}
module.exports.isValidCategory = isValidCategory
module.exports.verifyParameters = verifyParameters
module.exports.getAdImage = getAdImage
module.exports.getDefaultAdImage = getDefaultAdImage
