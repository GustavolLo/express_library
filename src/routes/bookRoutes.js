const express = require('express');
const mssql = require('mssql');
// const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new mssql.Request();
        const { recordset } = await request.query('select * from books');

        res.render('bookListView',
          {
            title: 'Library',
            nav,
            books: recordset
          });
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new mssql.Request();
        const { recordset } = await request
          .input('id', mssql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        next();
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
