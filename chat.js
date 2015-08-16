var Chatroom = {
	Chat: function(app) {
		var http = require('http').Server(app);
		var io = require('socket.io')(http);

		// 
		io.on('connection', function (socket) {
			console.log("Connect");
			var myname = "";

			socket.on('chat message', function (msg) {
				io.to(msg.room).emit('chat message', msg);
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
					socket.join(msg.room);
					sucmsg.act = "JOIN";
					socket.emit('success', sucmsg);
					break;

					case 'leave':
					socket.leave(msg.room);
					sucmsg.act = "LEAVE";
					socket.emit('success', sucmsg);
					break;

					case 'create':
					socket.join(msg.room) 
					sucmsg.act = "CREATE";
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
				socket.broadcast.emit('bye message', byemsg);
			})
		})

		return http;
	}
}

module.exports = Chatroom;