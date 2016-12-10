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
        var EpicResponseObject = {
            items: [],
            _links: {},
            pagination: {}
        };
        var query = {};
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        Book.find(query, function (err, books) {
            if (err) {
                return res.status(500).send(err);
            }
            books.forEach(function (element, index, array) {
                var newBook = element.toJSON();
                newBook._links = {};
                newBook._links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                EpicResponseObject.items.push(newBook);
            });
            //Links
            EpicResponseObject._links.self = 'http://' + req.headers.host + '/api/books/';
            //Pagination
            var totalBooks = books.length;
            var totalPages = totalBooks / 10;
            EpicResponseObject.pagination.totalItems = totalBooks;
            EpicResponseObject.pagination.totalPages = totalPages;
            //Response
            res.json(EpicResponseObject);
        });
    };
    return {
        post: post,
        get: get
    };
};

module.exports = bookController;