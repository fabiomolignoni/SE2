var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;

//Path dell'immagine del profilo predefinita
var defImg = '../images/default.png';

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Utente', new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    identification: {
        name: { type: String, required: true },
        surname: { type: String, required: true },
    },
    image: {
        data: { type: Buffer },
        contentType: { type: String },
        default: {
            data: fs.readFileSync(defImg),
            contentType: mongoose.Schema.Types.ObjectId
        }
    },
    phone: { type: String },
    ads: [
        {
            title: { type: String, required: true },
            desc: { type: String },
            price: { type: Number, required: true },
            date: { type: Date, required: true },
            images: [
                {
                    data: { type: Buffer },
                    contentType: { type: String }
                }
            ]
        }
    ]
}));