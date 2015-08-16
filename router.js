var router = require('express').Router();

router.get(/.*/, function(req, res, next) {
	if (req.path == '/') {
		next()
	} else if (req.path == '/favicon.ico') {
        res.sendFile(__dirname + '/favicon.ico');  
    } else {
        if ('username' in req.cookies) {
            next()
        }
        else {
            console.log("redirecting: " + req.path + ' to /')
            res.redirect('/')
        }
    }
})

router.get('/', function(req, res){
	if ('username' in req.cookies) // already logged in
        res.redirect('/chat');
    else  // go to login
        res.sendFile(__dirname + '/login.html');        
})

router.get('/chat', function(req, res){
	res.render('chatview', {username: req.cookies.username});
})

router.post('/log', function(req, res) {
	if (req.body.username) {
        var dbh = require('./dbhandler')();
        dbh.is_user_new(req.body.username, function (isnew) {
            if (isnew) {
                dbh.add_user(req.body.username)
            }
        });
        res.cookie('username', req.body.username, {maxAge: 200000})
        res.redirect('/chat');  
    }
    else 
		res.redirect('/');

})

module.exports = router;

