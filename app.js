var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');
db = mongoose.connect('mongodb://ivo:password@ds111718.mlab.com:11718/fullstack');

var Movie = require('./models/movieModel');
var app = express();
var port = process.env.PORT || 4005;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://fullstack-s.herokuapp.com/api/movies');
    res.header('Access-Control-Allow-Header', 'Content-Type, header');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, HEADERS');
    res.header('Allow', 'POST, GET, PUT, PATCH, HEADERS');
    if (!req.accepts('json')) {
        res.status(400);
        return res.send("Only json is accepted");
    } else {
        next();
    }
});

movieRouter = require('./Routes/movieRoutes')(Movie);
app.use('/api/movies', movieRouter);
app.get('/', function (req, res) {
    res.send('welcome to my <a href="https://fullstack-s.herokuapp.com/api/movies">API!</a>');
});
app.listen(port, function () {
    console.log('Gulp is running my app on PORT: ' + port);
});

module.exports = app;