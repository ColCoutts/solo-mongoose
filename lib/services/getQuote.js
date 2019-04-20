const request = require('superagent');

function getQuote() {
    return request
        .get('http://futuramaapi.herokuapp.com/api/quotes/1')
        .then(res => res.body[0].quote);
}

module.exports = getQuote;
