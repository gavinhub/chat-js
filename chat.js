var Chatroom = {
	Chat: function(app) {
		var http = require('http').Server(app);
		var io = require('socket.io')(http);

		// 
		io.on('connection', function (socket) {
			console.log("Connect");
			var dbh = require('./dbhandler')();

			socket.on('chat message', function (msg) {
				msg.time = Date.parse(new Date()) / 1000;
				dbh.add_talk(msg, function (err, lastid) {
					if (err)
						socket.emit("error", "database error");
					else {
						msg.talkid = lastid;
						io.to(msg.room).emit('chat message', msg);					
					}
				})
			});

			socket.on('grp command', function (msg) {
				console.log("Grp command: ",msg)
				var cmd = msg.command;
				var sucmsg = {
					act: "",
					room: msg.room
				}
				switch (cmd) {
					case 'join': 
					dbh.user_join_grp(msg.username, msg.room)
					socket.join(msg.room);
					sucmsg.act = "JOIN";
					socket.emit('success', sucmsg);
					break;

					case 'leave':
					socket.leave(msg.room);
					sucmsg.act = "LEAVE";
					socket.emit('success', sucmsg);
					break;

					default:
					console.err('bad command');
					socket.emit('error', 'Bad grp command.');
				}
			})

			socket.on('disconnect', function () {
				var byemsg = {

				}
				dbh.close();
				socket.broadcast.emit('bye message', byemsg);
			})
		})

		return http;
	}
}

module.exports = Chatroom;