var express = require('express');

var routes = function (Movie) {
    var movieRouter = express.Router();

    var movieController = require('../Controllers/movieController')(Movie);
    movieRouter.route('/')
        .post(movieController.post)
        .get(movieController.get);
        // .options(function (err, res) {
        //     res.header('Allow', 'GET, POST, OPTIONS, HEADER');
        //     res.send(200);
        // });
    movieRouter.use('/:movieId', function (req, res, next) {
        Movie.findById(req.params.movieId, function (err, movie) {
            if (err)
                res.status(500).send(err);
            else if (movie) {
                req.movie = movie;
                next();
            }
            else {
                res.status(404).send('No movie found');
            }
        });
    });
    movieRouter.route('/:movieId')
        .get(function (req, res) {
            var home = 'https://fullstack-s.herokuapp.com/api/movies/';
            var returnMovie = req.movie.toJSON();
            returnMovie._links = {
                self: {
                    href: home + returnMovie._id
                },
                collection: {
                    href: home
                }
            };
            res.json(returnMovie);
        })
        .put(function (req, res) {
            if (!req.body.title || !req.body.director || !req.body.genre) {
                res.status(418).json({message: 'cannot leave anything empty'});
            } else {
                req.movie.title = req.body.title;
                req.movie.director = req.body.director;
                req.movie.genre = req.body.genre;
                req.movie.save(function (err) {
                    if (err)
                        res.status(500).send(err);
                    else {
                        res.json(req.movie);
                    }
                });
            }
        })
        .delete(function (req, res) {
            req.movie.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
        // .options(function (err, res) {
        //     res.header('Allow', 'GET, POST, OPTIONS, HEADER');
        //     res.send(200);
        // });

    return movieRouter;
};


module.exports = routes;