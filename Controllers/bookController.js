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
        //Params
        if(req.params.start) {
            var start = req.params.start;
        }else{
            var start = 1;
        }
        var totalBooks;
        Book.find(query, function (books) {
            totalBooks = books.length;
        });
        Book.find(query,{}, {start: start, limit: 5}, function (err, books) {
            if (err) {
                return res.status(500).send(err);
            }
            books.forEach(function (element, index, array) {
                var newBook = element.toJSON();
                newBook._links = {};
                newBook._links.self = {};
                newBook._links.self.href = 'http://' + req.headers.host + '/api/books/' + newBook._id;
                newBook._links.collection = {};
                newBook._links.collection.href = 'http://' + req.headers.host + '/api/books/';
                EpicResponseObject.items.push(newBook);
            });
            //Links
            EpicResponseObject._links.self = {};
            EpicResponseObject._links.self.href = 'http://' + req.headers.host + '/api/books/';
            //Pagination
            var itemsPerPage = 5;
            var totalPages = Math.ceil(totalBooks/itemsPerPage);
            EpicResponseObject.pagination.totalItems = totalBooks;
            EpicResponseObject.pagination.totalPages = totalPages;
            //Pagination links
            EpicResponseObject.pagination._links = {};
            //First
            EpicResponseObject.pagination._links.first = {};
            EpicResponseObject.pagination._links.first.page = 'Page 1';
            EpicResponseObject.pagination._links.first.href = 'http://' + req.headers.host + '/api/books/?page=1';
            //Last
            EpicResponseObject.pagination._links.last = {};
            EpicResponseObject.pagination._links.last.page = 'Page ' + totalPages;
            EpicResponseObject.pagination._links.last.href = 'http://' + req.headers.host + '/api/books/?page=' + totalPages;
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