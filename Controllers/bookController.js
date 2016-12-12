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
        var home = 'https://fullstack-s.herokuapp.com/api/books/';
        Book.find(function (err, books) {
            if (err) {
                return res.status(500).send(err);
            }
            var start = req.query.start !== undefined ? parseInt(req.query.start) : null;
            var limit = req.query.limit !== undefined ? parseInt(req.query.limit) : null;
            var pagination = {
                totalPages: limit !== null ? Math.ceil(books.length / limit) - 1 : 1,
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
                    currentPage: pagination.currentPage < 1 ? 1 : pagination.currentPage,
                    _links: {
                        next: {
                            page: pagination.totalPages !== pagination.currentPage ? pagination.currentPage + 1 : pagination.currentPage,
                            href: home + '?start=' + (start + pagination.currentItems) + '&limit=' + (limit || 0)
                        },
                        previous: {
                            page: pagination.currentPage > 1 ? pagination.currentPage - 1 : 1,
                            href: home + '?start=' + (start >= pagination.currentItems ? start - pagination.currentItems : 0) + '&limit=' + (limit || 0)
                        },
                        first: {
                            page: 1,
                            href: home + (start ? '?start=' + start : '') + (limit ? '&limit=' + limit : '')
                        },
                        last: {
                            page: pagination.totalPages,
                            href: home + '?start=' + (limit ? books.length - limit : 0) + '&limit=' + (limit || 0)
                        }
                    }
                }
            };
            for (var i = start || 0, length = books.length, l = 0; i < length && (limit !== null ? l < limit : 1); i++, l++) {
                var oneBook = books[i];
                EpicResponseObject.items.push({
                    item: oneBook,
                    _links: {
                        self: {
                            href: home + oneBook._id
                        },
                        collection: {
                            href: home
                        }
                    }
                });
            }
            res.status(200).json(EpicResponseObject);
        });
    };
    return {
        post: post,
        get: get
    };
};

module.exports = bookController;