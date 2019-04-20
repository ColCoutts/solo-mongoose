const getQuote = require('../services/getQuote');

module.exports = (req, res, next) => {
    if(req.query.random === 'true') {
        getQuote()
            .then(quoteObj => {
                req.body.body = quoteObj;
                next();
            });
        } else {
            next();
        }
};
