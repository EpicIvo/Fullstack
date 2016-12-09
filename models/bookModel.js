var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bookModel = new Schema({
    _id: {type: String},
    title: String,
    author: String,
    genre: String
});

module.exports = mongoose.model('Book', bookModel);