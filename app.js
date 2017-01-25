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
    // res.header('Accept', 'application/json');
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Header', 'Accept, Accept-Language, Content-Language, Content-Type');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEADER');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    res.header('Allow', 'GET, POST, OPTIONS, HEADER');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEADER");
    res.header("Access-Control-Allow-Credentials", false);
    res.header("Access-Control-Max-Age", "86400");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
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