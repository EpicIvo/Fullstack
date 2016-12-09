var ObjectID = require('mongodb').ObjectID;

var bookController = function (Book) {
    var post = function (req, res) {
        var objectId = new ObjectID();
        var book = new Book();
        book.items.push({
            _id: objectId,
            author: req.body.author,
            genre: req.body.genre,
            title: req.body.title
        });
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
        var currentPage = req.query.currentPage;
        var pageSize = req.query.pageSize;

        var query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Book.find(query, {}, {limit: 1}, function (err, books) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                var returnBooks = [];
            }
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