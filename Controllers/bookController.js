var bookController = function (Book) {
    var post = function (req, res) {
        var book = new Book();
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.title = req.body.title;

        if (book.title == null || book.author == null || book.genre == null) {
            return res.status(400).send("Keine empty fields BITTE!");
        }

        book.save(function (err) {
            if (err) {
                console.log(err);
            }
            return res.status(201).json({'res': 'created successfully'});
        });
    };
    var get = function (req, res) {
        var query = {};
        Book.find(query, function (err, books) {
            if (err) {
                return res.status(500).send(err);
            }
            var home = 'http://' + req.headers.host + '/api/books/';

            var start = req.query.start !== undefined ? parseInt(req.query.start) : null;
            var limit = req.query.limit !== undefined ? parseInt(req.query.limit) : null;

            var pagination = {
                TotalPages: limit !== null ? Math.ceil(books.length / limit) - 1 : 1,
                currentItems: limit !== null ? limit : books.length,
                currentPage: (start !== null && limit !== null) ? Math.ceil(start / limit) : 1
            };

            var EpicResponseObject = {
                items: [],
                _links: {
                    self: {
                        href: home
                    }
                },
                pagination: {
                    totalItems: books.length,
                    totalPages: pagination.totalPages,
                    currentItems: pagination.currentItems,
                    currentPage: pagination.currentPage,
                    _links: {
                        next: {
                            page: pagination.currentPage + 1,
                            href: home + '?start' + (start + pagination.currentItems) + '&limit=' + (limit || 0)
                        },
                        previous: {
                            page: pagination.currentItems - 1,
                            href: home + '?start=' + (start >= pagination.currentItems ? start - pagination.currentItems : 0) + '&limit=' + (limit || 0)
                        },
                        first: {
                            page: 1,
                            href: home + (limit ? '?limit=' + limit : '')
                        },
                        last: {
                            page: pagination.totalPages,
                            href: home + '?start' + books.length - limit
                        }
                    }
                }
            };
            //Books
            for (var i = start || 0, length = books.length, l = 0; i < length && (limit !== null ? l < limit : 1); i++, l++) {
                EpicResponseObject.items.push({
                    item: book,
                    _links: {
                        self: {
                            href: home + book._id
                        },
                        collection: {
                            href: home
                        }
                    }
                });
            }
        });
    };
    return {
        post: post,
        get: get
    };
};

module.exports = bookController;