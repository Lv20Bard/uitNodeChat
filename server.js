var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');

// your default messages and users array: this is where you'll store your messages and users
var messages = [];
var users = [];
var connected = [];

// set up to accept json as parameters
app.use(bodyParser.json());

// @NOTE: do this if you want to change the default directory for views, which is /views
app.set('views', path.join(__dirname, '/templates'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the static path (for css, js, etc.)
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// routes via express
app.get('/', function(req, res) {

	var tagline = "Welcome to the chat my dudes"

	// Render the index
	res.render('index',{
		tagline: tagline
	});


});


// socket.io functionality
io.on('connection', function(socket){

	connected.push(socket);
	console.log('User Connected! %s Users connected!', connected.length);
	

	//disconnect
	socket.on('disconnect',function(data){
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		
		connected.splice(connected.indexOf(socket), 1);
		console.log('User Disconnected! %s Users connected', connected.length);
		
	
	});

	// Send message
	socket.on('send message', function(data){
		io.emit('new message', {msg: data, user:socket.username});
	});



	//add user
	socket.on('new users', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.emit('get users', users);
	};


});



http.listen(8080);
console.log("Listening on port 8080...");