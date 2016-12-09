var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

var db;
//LOCAL
// if (process.env.ENV == 'Test') {
//     db = mongoose.connect('mongodb://localhost/bookAPI_test');
// }
// else {
//     db = mongoose.connect('mongodb://localhost/bookAPI');
// }

//LIVE
if (process.env.ENV == 'Test') {
    db = mongoose.connect('mongodb://ivo:password@ds111718.mlab.com:11718/fullstack');
}
else {
    db = mongoose.connect('mongodb://ivo:password@ds111718.mlab.com:11718/fullstack');
}

var Book = require('./models/bookModel');
var app = express();
var port = process.env.PORT || 4005;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json(
    function () {
        return true;
    }
));

app.use(function (req, res, next) {
   if(!req.accepts('json')) {
       res.status(400);
       return res.send("Only json is accepted");
   }
   next();
});

bookRouter = require('./Routes/bookRoutes')(Book);
app.use('/api/books', bookRouter);
app.get('/', function (req, res) {
    res.send('welcome to my <a href="https://fullstack-s.herokuapp.com/api/books">API!</a>');
});
app.listen(port, function () {
    console.log('Gulp is running my app on PORT: ' + port);
});

module.exports = app;