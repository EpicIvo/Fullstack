var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var movieModel = new Schema({
    title: String,
    director: String,
    genre: String
});

module.exports = mongoose.model('Book', movieModel);