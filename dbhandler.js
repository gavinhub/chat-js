var DBHandler = function () {
    var sqlite3 = require('sqlite3').verbose();

    console.Error = function (label, err) {
        console.error("\033[31m",label,"\033[0m",err)
    }

    this.connect = function () {
        this.db = new sqlite3.Database('db/chatroom.db');
    }
    this.close = function () {
        this.db.close(function (err) {
            if (err)
                console.Error("database close error: ", err)
        });
    }


    this.get_grplist_by_user = function (user, callback) {
        this.connect();
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
        this.close()
    }

    this.is_user_new = function (user, callback) {
        this.get_grplist_by_user(user, function (rows) {
            callback((rows.length == 0))
        });
    }

    this.add_user = function (user) {
        this.connect();
        var query = "INSERT INTO `membership` VALUES(?, 'all')";
        console.log("add_user: ",query, user);
        this.db.run(query, user, function (err) {
            if (err) 
                console.Error("Insert user err: ", err);
        });
        this.close()
    }

    this.user_join_grp = function (user, grp) {
        if (!(user && grp)) {
            console.Error("Join grp error:", "Empty user or grp");
            return;
        }
        this.connect();
        var query = "INSERT INTO `membership` VALUES(?, ?)";
        console.log(query, [user, grp]);
        this.db.run(query, [user, grp], function (err) {
            if (err)
                console.Error("Join grp error:", err);
        })
        this.close()
    }

    this.user_leave_grp = function (user, grp) {
        if (!(user && grp)) {
            console.Error("Leave grp error:", "Empty user or grp");
            return;
        }
        this.connect();
        var query = "DELETE FROM `membership` WHERE `user` = (?) AND grp = (?)";
        console.log(query, [user, grp]);
        this.db.run(query, [user, grp], function (err) {
            if (err)
                console.Error("Leave grp error:", err);
        })
        this.close()
    }

    this.add_talk = function (msg, callback) {
        this.connect();
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
        this.close()
    }

    this.get_talk = function (grp, cursor, number, callback) {
        this.connect();
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
        this.close()
    }

    this.get_peer = function (grp, callback) {
        this.connect();
        var query = "SELECT `user` FROM `membership` WHERE `grp` = ?";
        this.db.all(query, grp, function (err, rows) {
            var ans = Array()
            if (err)
                console.Error("Get peer error: ", err)
            else {
                for (var i = 0; i < rows.length; i ++) {
                    ans.push(rows[i].user)
                }
            }
            callback(ans)
        })
        this.close()
    }

    return this;
}

module.exports = DBHandler;