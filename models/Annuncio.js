var mongoose = require('mongoose');
var fs = require('fs');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Annuncio', new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utente'
    },
    title: { type: String, required: true },
    desc: { type: String },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    category: { type: Number, required: true}, //Come implementare le categorie?
    images: [
        {
            data: { type: Buffer },
            contentType: { type: String }
        }
    ]
},
{collection: 'annunci'}));
