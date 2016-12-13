var movieController = function (Movie) {
    var post = function (req, res) {
        var movie = new Movie();
        movie.title = req.body.title;
        movie.director = req.body.director;
        movie.genre = req.body.genre;
        if (movie.title == null || movie.director == null || movie.genre == null) {
            return res.status(400).send("Cannot take empty fields");
        }
        movie.save(function (err) {
            if (err) {
                console.log(err);
            }
            return res.status(201).json({'res': 'created successfully'});
        });
    };
    var get = function (req, res) {
        var home = 'https://fullstack-s.herokuapp.com/api/books/';
        Movie.find(function (err, movies) {
            if (err) {
                return res.status(500).send(err);
            }
            var start = req.query.start !== undefined ? parseInt(req.query.start) : null;
            var limit = req.query.limit !== undefined ? parseInt(req.query.limit) : null;
            if (start == 0){
                start = 1;
            }
            var pagination = {
                totalPages: limit !== null ? Math.ceil(movies.length / limit) : 1,
                currentItems: limit !== null ? limit : movies.length,
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
                    totalItems: movies.length,
                    totalPages: pagination.totalPages,
                    currentItems: pagination.currentItems,
                    currentPage: pagination.currentPage,
                    _links: {
                        next: {
                            page: pagination.totalPages !== pagination.currentPage ? pagination.currentPage + 1 : pagination.currentPage,
                            href: home + '?start=' + (start + pagination.currentItems) + '&limit=' + (limit || 0)
                        },
                        previous: {
                            page: (pagination.currentPage !== 1 ? pagination.currentPage - 1 : 1),
                            href: home + '?start=' + (start >= pagination.currentItems ? start - pagination.currentItems : 0) + '&limit=' + (limit || 0)
                        },
                        first: {
                            page: 1,
                            href: home + (limit ? '?limit=' + limit : '')
                        },
                        last: {
                            page: pagination.totalPages,
                            href: home + '?start=' + (limit ? (books.length + 1) - limit : 0) + '&limit=' + (limit || 0)
                        }
                    }
                }
            };
            for (var i = start || 0, length = movies.length, l = 0; i < length && (limit !== null ? l < limit : 1); i++, l++) {
                var movie = movies[i];
                EpicResponseObject.items.push({
                    item: movie,
                    _links: {
                        self: {
                            href: home + movie._id
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

module.exports = movieController;