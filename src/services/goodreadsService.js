const debug = require('debug')('app:goodreadsService');
const axios = require('axios');
const xml2js = require('xml2js');

const parser = xml2js.Parser({ explicitArray: false });

function goodreadsService() {
  function getBookById() {
    return new Promise((resolve, reject) => {
      axios.get('https://www.goodreads.com/book/show/656.xml?key=55MUOVyvd5iVWQ43V9tPA')
        .then((response) => {
          parser.parseString(response.data, (error, result) => {
            if (error) {
              debug(error);
            } else {
              debug(result);
              resolve(result.GoodreadsResponse.book);
            }
          });
        })
        .catch((error) => {
          debug(error);
          reject(error);
        });
    });
  }

  return { getBookById };
}

module.exports = goodreadsService();
