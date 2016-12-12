var express = require('express');

var routes = function (Book) {
    var bookRouter = express.Router();

    var bookController = require('../Controllers/bookController')(Book);
    bookRouter.route('/')
        .post(bookController.post)
        .get(bookController.get)

        .options(function (err, res) {
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.send(200);
        });

    bookRouter.use('/:bookId', function (req, res, next) {
        Book.findById(req.params.bookId, function (err, book) {
            if (err)
                res.status(500).send(err);
            else if (book) {
                req.book = book;
                next();
            }
            else {
                res.status(404).send('no book found');
            }
        });
    });
    bookRouter.route('/:bookId')
        .options(function (err, res) {
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.header('Accept', 'application/json');
            res.send(200);
        })
        .get(function (req, res) {
            var home = 'https://fullstack-s.herokuapp.com/api/books/';
            var returnBook = req.book.toJSON();
            returnBook._links = {
                self: {
                    href: home + returnBook._id
                },
                collection: {
                    href: home
                }
            };
            res.json(returnBook);
        })
        .put(function (req, res) {
            console.log(req.book.title);
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.genre;
            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })
        .patch(function (req, res) {
            if (req.body._id)
                delete req.body._id;

            for (var p in req.body) {
                req.book[p] = req.body[p];
            }

            req.book.save(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.json(req.book);
                }
            });
        })
        .delete(function (req, res) {
            req.book.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    return bookRouter;
};


module.exports = routes;