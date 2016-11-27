var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db;
console.log('Hello');
if (process.env.ENV == 'Test') {
    db = mongoose.connect('mongodb://ivo:password@ds111718.mlab.com:11718/fullstack');
}
else {
    db = mongoose.connect('mongodb://ivo:password@ds111718.mlab.com:11718/fullstack');
}

var Book = require('./models/bookModel');
var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

bookRouter = require('./Routes/bookRoutes')(Book);

app.use(function (req, res, next) {
    res.header("Connection", "Keep-Alive");
    res.header("Content-type", "application/json");

    req.header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
    // req.header("Accept-Encoding", "gzip, deflate, sdch");
    // req.header("Accept-Language", "nl-NL,nl;q=0.8,en-US;q=0.6,en;q=0.4,fr;q=0.2");
    // req.header("Cache-Control", "max-age=0");
    // req.header("Connection", "Keep-Alive");
    // req.header("Host", "fullstack-s.herokuapp.com");
    next();
});

app.use('/api/books', bookRouter);
app.get('/', function (req, res) {
    res.send('welcome to my API!');
});
app.listen(port, function () {
    console.log('Gulp is running my app on PORT: ' + port);
});

module.exports = app;