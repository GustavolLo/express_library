const express = require('express');
const mssql = require('mssql');
const debug = require('debug')('app:bookRoutes');
const { MongoClient, ObjectID } = require('mongodb');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
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
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
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
          req.book = book;
          next();
        } catch (error) {
          debug(error.stack);
        }
      }());
    })
    .get((req, res) => {
      res.render('bookView',
        {
          title: 'Library',
          nav,
          book: req.book
        });
    });

  return bookRouter;
}

module.exports = router;
