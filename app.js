var express = require("express")
var app = express();

var http = require('http').Server(app);
var io = require("socket.io")(http);

var router = require('./router');
var api = require('./api');
var cookie = require('cookie-parser');
var bp = require('body-parser');
var path = require('path');

// settings
app.set('views', './views')
app.set('view engine', 'ejs')

// midwares
app.use(cookie());
app.use(bp.urlencoded({extended: false}));
app.use(bp.json());
app.use(express.static(path.join(__dirname, 'public')));

// route
app.use('/', router);
app.use('/api', api);

// socket io
var chat = require('./chat').Chat(app)

chat.listen(3000, function() {
  console.log('Chatroom app listening at 3000');
});
