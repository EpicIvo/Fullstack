var express = require('express');

var routes = function (Movie) {
    var movieRouter = express.Router();

    var movieController = require('../Controllers/movieController')(Movie);
    movieRouter.route('/')
        .post(movieController.post)
        .get(movieController.get)
        .options(function (err, res) {
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.send(200);
        });
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
        .options(function (err, res) {
            res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
            res.header('Accept', 'application/json');
            res.send(200);
        })
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
            if (!req.body.title || !req.body.director || !req.body.genre ) {
                res.status(418).json({message: 'cannot leave anything empty'});
            }else{
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
        // .patch(function (req, res) {
        //     if (req.body._id)
        //         delete req.body._id;
        //     for (var p in req.body) {
        //         req.movie[p] = req.body[p];
        //     }
        //     req.movie.save(function (err) {
        //         if (err)
        //             res.status(500).send(err);
        //         else {
        //             res.json(req.movie);
        //         }
        //     });
        // })
        .delete(function (req, res) {
            req.movie.remove(function (err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    return movieRouter;
};


module.exports = routes;