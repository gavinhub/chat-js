var DBHandler = function () {
    var sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database('db/chatroom.db');

    console.Error = function (label, err) {
        console.error("\033[31m",label,"\033[0m",err)
    }


    this.get_grplist_by_user = function (user, callback) {
        var query = "SELECT `grp` FROM `membership` WHERE `user`= ?";
        console.log("get_grplist_by_user: ", query, user);
        this.db.all(query, user, function (err, rows) {
            if (err)
                console.Error("select grp error: ", err)
            else {
                var ans = Array()
                for (var i = 0; i < rows.length; i ++) {
                    ans.push(rows[i].grp)
                }
                callback(ans);
            }
        })
    }

    this.is_user_new = function (user, callback) {
        this.get_grplist_by_user(user, function (rows) {
            callback((rows.length == 0))
        });
    }

    this.add_user = function (user) {
        var query = "INSERT INTO `membership` VALUES(?, 'all')";
        console.log("add_user: ",query, user);
        this.db.run(query, user, function (err) {
            if (err) 
                console.Error("Insert user err: ", err);
        });
    }

    this.user_join_grp = function (user, grp) {
        var query = "INSERT INTO `membership` VALUES(?, ?)";
        console.log(query, [user, grp]);
        this.db.run(query, [user, grp], function (err) {
            if (err)
                console.Error("Join grp error:", err);
        })
    }

    this.add_talk = function (msg, callback) {
        var query = "INSERT INTO `talk` (user, color, text, grp, time) VALUES($username, $color, $text, $room, $time)";
        this.db.run(query, {
            $username: msg.username,
            $color: msg.color,
            $text: msg.text,
            $room: msg.room,
            $time: msg.time
        }, function (err) {
            if (err) 
                console.Error("Add talk error: ", err)
            callback(err, this.lastID)
        })
    }

    this.get_talk = function (grp, cursor, number, callback) {
        var startlimit = "AND id < ?"
        if (cursor == 0)
            startlimit = "AND id != ?"
        var query = "SELECT * FROM `talk` WHERE grp = ? "+startlimit+" ORDER BY id DESC LIMIT ?";
        console.log("Get talk query:",query)
        this.db.all(query, grp, cursor, number, function (err, rows) {
            if (err)
                console.Error("Get talk error: ", err)
            callback(err, rows)
        })
    }

    this.close = function () {
        this.db.close(function (err) {
            if (err)
                console.Error("database close error: ", err)
        });
    }

    return this;
}

module.exports = DBHandler;