var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);




//Homepage
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

//Socket.IO 
var body = "";

//Socket.IO on connection
io.on('connection', function (socket) {
  console.log('a user has connected');
  console.log('number of users:' + Object.keys(io.sockets.connected).length);
  socket.emit('refresh', { body: body });

//Socket.IO on refresh
  socket.on('refresh', function (body_) {
    console.log('new body');
    body = body_;
  });

//Socket.IO on change
  socket.on('change', function (op) {
    console.log(op);
    if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
      socket.broadcast.emit('change', op);
    };
  });

//Socket.IO when use disconnects
  socket.on('disconnect', function () {
    console.log('a user has disconnected');
    console.log('number of users:' + Object.keys(io.sockets.connected).length);

  });
});

//Adding bower components
app.use('/bower_components', express.static('bower_components'));


//Port
http.listen(3000, function () {
  console.log('listening on *:3000');
});