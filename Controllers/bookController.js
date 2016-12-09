var bookController = function (Book) {
    var post = function (req, res) {
        var book = new Book();

        book.author = req.body.author;
        book.genre = req.body.genre;
        book.title = req.body.title;

        if (book.title === null || book.author === null || book.genre === null) {
            console.log('not sent');
            res.status(400);
            res.send('Empty fields are not allowed');
        }
        else {
            console.log('title: ' + book.title);
            book.save();
            res.status(201);
            res.json(book);
        }
    };
    var get = function (req, res) {
        var EpicResponseObject = {
            items: [],
            _links: {},
            pagination: {}
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


            // Initiate pagination

            res.json(EpicResponseObject);
        });
    };
    return {
        post: post,
        get: get
    };
};

module.exports = bookController;