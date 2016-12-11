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
        //Params
        var totalBooks;
        Book.find(query, function (err, books) {
            if (err) {
                return res.status(500).send(err);
            }
            totalBooks = books.length;
        });

        if (req.query.page) {
            var skip = (req.query.page - 1) * 5;
            var currentPage = req.query.page;
        } else {
            var skip = 0;
            var currentPage = 1;
        }
        Book.find(query, {}, {skip: skip, limit: 7}, function (err, books) {
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
            var itemsPerPage = 7;
            var totalPages = Math.ceil(totalBooks / itemsPerPage);
            EpicResponseObject.pagination.currentPage = currentPage;
            EpicResponseObject.pagination.currentItems = books.length;
            EpicResponseObject.pagination.totalPages = totalPages;
            EpicResponseObject.pagination.totalItems = totalBooks;
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
            //Next
            var nextPage = currentPage + 1;
            EpicResponseObject.pagination._links.next = {};
            if (nextPage > totalPages) {
                EpicResponseObject.pagination._links.next.page = 'Page ' + totalPages;
                EpicResponseObject.pagination._links.next.href = 'http://' + req.headers.host + '/api/books/?page=' + totalPages;
            } else {
                EpicResponseObject.pagination._links.next.page = 'Page ' + nextPage;
                EpicResponseObject.pagination._links.next.href = 'http://' + req.headers.host + '/api/books/?page=' + nextPage;
            }
            //Previous
            var previousPage = currentPage - 1;
            EpicResponseObject.pagination._links.previous = {};
            if (previousPage < 1) {
                EpicResponseObject.pagination._links.previous.page = 'Page 1';
                EpicResponseObject.pagination._links.previous.href = 'http://' + req.headers.host + '/api/books/?page=1';
            } else {
                EpicResponseObject.pagination._links.previous.page = 'Page ' + previousPage;
                EpicResponseObject.pagination._links.previous.href = 'http://' + req.headers.host + '/api/books/?page=' + previousPage;
            }
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