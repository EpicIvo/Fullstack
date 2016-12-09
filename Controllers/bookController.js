var bookController = function (Book) {
    var post = function (req, res) {
        var book = new Book();
        book.author = req.body.author;
        book.genre = req.body.genre;
        book.title = req.body.title;
    };
    if (!req.body.title || !req.body.genre || !req.body.author) {
        res.status(400);
        res.send('Title is required');
    }
    else {
        book.save();
        res.status(201);
        res.send(book);
    }
};
var get = function (req, res) {
    var EpicResponseObject = {
        items: [],
        _links: {},
        vagination: {}
    };
    var query = {};
    if (req.query.genre) {
        query.genre = req.query.genre;
    }
    Book.find(query, {}, {limit: 10}, function (err, books) {
        if (err) {
            return res.status(500).send(err);
        }
        books.forEach(function (element, index, array) {
            var newBook = element.toJSON();
            newBook.items._links = {};
            newBook.items._links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
            EpicResponseObject.items.push(newBook);
        });

        // Commence links


        // Initiate vagination

        res.json(EpicResponseObject);
    });
};
return {
    post: post,
    get: get
};

module.exports = bookController;