var api = require('express').Router();

api.get('/grplist', function (req, res) {
    var msg = {
        list: ['man', 'woman', 'alien']
    }
    res.json(msg);
})

module.exports = api;

