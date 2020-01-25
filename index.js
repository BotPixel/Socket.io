var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.emit('chat message', 'New Socket Connected.')
  socket.room = 'classic';
  
  socket.on('create', function(room) {
    io.emit('chat message', 'Joined Room.')
    socket.room = room;
    socket.join(room);
  });
  
  socket.on('chat message', function(data) {
    io.in(socket.room).emit('chat message', data);
  });
  
  socket.on('leave', function(room) {
    io.emit('chat message', 'Left Room.')
    socket.room = 'classic';
    socket.disconnect;
  });
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
