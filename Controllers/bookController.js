var ObjectID = require('mongodb').ObjectID;

var bookController = function (Book) {
    var post = function (req, res) {
        var objectId = new ObjectID();
        var book = new Book();
        book.items._id = objectId;
        book.items.title = req.body.title;
        book.items.genre = req.body.genre;
        book.items.author = req.body.author;
        if (!req.body.title) {
            res.status(400);
            res.send('Title is required');
        }
        else {
            book.save();
            res.status(201);
            res.send(book);
        }
    };
    var get = function (req, res) {
        var query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Book.find(query, function (err, books) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                var returnBooks = [];
            }
            returnBooks._links.self = 'http://' + req.headers.host + '/api/books/';
            returnBooks.pagination.pages = 4;
            books.forEach(function (element, index, array) {
                var newBook = element.toJSON();
                newBook.items._links = {};
                newBook.items._links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                returnBooks.push(newBook);
            });
            res.json(returnBooks);
        });
    };
    return {
        post: post,
        get: get
    }
};

module.exports = bookController;