const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const confg = {
  user: 'express-library',
  password: '34AVb4R5*a',
  server: 'express-library.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'ExpressLibrary',

  options: {
    encrypt: true // use this if you are on Windows Azure
  }
};

sql.connect(confg).catch((error) => debug(error));

app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      title: 'Library',
      nav
    }
  );
});

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
