const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(nav) {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  function getBooks(req, res) {
    (async function query() {
      // const request = new mssql.Request();
      // const { recordset } = await request.query('select * from books');
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to server');
        const db = await client.db(dbName);
        const col = await db.collection('books');
        const books = await col.find().toArray();

        res.render('bookListView',
          {
            title: 'Library',
            nav,
            books
          });
      } catch (error) {
        debug(error);
      }
      client.close();
    }());
  }
  function getBookById(req, res) {
    (async function query() {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected to the server');
        const db = await client.db(dbName);
        const col = await db.collection('books');
        const book = await col.findOne({ _id: new ObjectID(id) });
        res.render('bookView',
          {
            title: 'Library',
            nav,
            book
          });
      } catch (error) {
        debug(error.stack);
      }
    }());
  }
  return {
    getBooks,
    getBookById,
    middleware
  };
}

module.exports = bookController;
