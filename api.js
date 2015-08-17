var api = require('express').Router();
var dbh = require('./dbhandler')();

api.get('/grplist', function (req, res) {
    var user = req.query.user
    dbh.get_grplist_by_user(user, function (grps) {
        console.log(grps);
        res.json({list:grps})
    })
})

api.get('/peerlist', function (req, res) {
    res.json({list:['a','b','c']})
})

api.get('/talk', function (req, res) {
    var grp = req.query.grp;
    var cursor = req.query.cursor || 0;
    var number = req.query.number || 30;
    dbh.get_talk(grp, cursor, number, function (err, talks) {
        if (err)
            res.json([])
        res.json(talks);
    })
})

module.exports = api;

