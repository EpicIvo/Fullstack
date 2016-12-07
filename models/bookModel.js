var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bookModel = new Schema({
    items: {
        _id: {type: String},
        _links: {},
        title: String,
        author: String,
        genre: String,
        read: {type: Boolean, default: false}
    },
    _links: {},
    pagination: {},
});

module.exports = mongoose.model('Book', bookModel);