var DBHandler = function () {
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('db/chatroom.db');

    this.get_grplist_by_user = function (user, callback) {
        var query = "SELECT `grp` FROM `membership` WHERE `user`= ?";
        this.db.all(query, user, function (err, rows) {
            callback(rows);
        })
    }

    this.is_user_new = function (user, callback) {
        this.get_grplist_by_user(user, function (rows) {
            callback((rows.length == 0))
        });
    }

    this.add_user = function (user) {
        ;
    }

    this.close = function () {
        this.db.close();
    }

    return this;
}

module.exports = DBHandler;