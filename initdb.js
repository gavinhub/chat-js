var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/chatroom.db');

db.serialize(function() {

    db.exec("DROP TABLE IF EXISTS membership;DROP TABLE IF EXISTS talk;")


    db.exec("CREATE TABLE membership(user varchar(20), grp varchar(20));");
    db.exec("CREATE TABLE talk(id integer primary key AutoIncrement, user varchar(20), color varchar(8), text TEXT, grp varchar(20), time integer);");

});

db.close();