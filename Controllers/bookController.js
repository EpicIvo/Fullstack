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
        //Page
        var currentPage;
        if (req.query.page) {
            currentPage = req.query.page;
        } else {
            currentPage = 1;
        }
        //Start and limit
        var start;
        var limit;
        if(req.query.start && req.query.limit){
            start = req.query.start;
            limit = req.query.limit;
        }else{
            start = 0;
            limit = 1000;
        }
        console.log("start: " + start + "  -  limit: " + limit);
        Book.find(query,{}, {start: start, limit: limit}, function (err, books) {
            var totalBooks = books.length;
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
            var totalPages = Math.ceil(totalBooks / 7);
            EpicResponseObject.pagination.currentPage = currentPage;
            EpicResponseObject.pagination.currentItems = books.length;
            EpicResponseObject.pagination.totalPages = totalPages;
            EpicResponseObject.pagination.totalItems = totalBooks;
            //Pagination links
            EpicResponseObject.pagination._links = {};
            //First
            EpicResponseObject.pagination._links.first = {};
            EpicResponseObject.pagination._links.first.page = 'Page 1';
            EpicResponseObject.pagination._links.first.href = 'http://' + req.headers.host + '/api/books/?page=1&start=1&limit=7';
            //Last
            EpicResponseObject.pagination._links.last = {};
            EpicResponseObject.pagination._links.last.page = 'Page ' + totalPages;
            EpicResponseObject.pagination._links.last.href = 'http://' + req.headers.host + '/api/books/?page=' + totalPages + '&start=' + (totalPages - 1) * 7 + '&limit=7';
            //Next
            var nextPage = currentPage + 1;
            EpicResponseObject.pagination._links.next = {};
            if (nextPage > totalPages) {
                EpicResponseObject.pagination._links.next.page = 'Page ' + totalPages;
                EpicResponseObject.pagination._links.next.href = 'http://' + req.headers.host + '/api/books/?page=' + totalPages + '&start=' + (totalPages - 1) * 7 + '&limit=7';
            } else {
                EpicResponseObject.pagination._links.next.page = 'Page ' + nextPage;
                EpicResponseObject.pagination._links.next.href = 'http://' + req.headers.host + '/api/books/?page=' + nextPage + '&start=' + (nextPage - 1) * 7 + '&limit=7';
            }
            //Previous
            var previousPage = currentPage - 1;
            EpicResponseObject.pagination._links.previous = {};
            if (previousPage < 1) {
                EpicResponseObject.pagination._links.previous.page = 'Page 1';
                EpicResponseObject.pagination._links.previous.href = 'http://' + req.headers.host + '/api/books/?page=1';
            } else {
                EpicResponseObject.pagination._links.previous.page = 'Page ' + previousPage;
                EpicResponseObject.pagination._links.previous.href = 'http://' + req.headers.host + '/api/books/?page=' + previousPage + nextPage + '&start=' + (previousPage - 1) * 7 + '&limit=7';
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