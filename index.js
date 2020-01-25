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
  socket.join('classic');
  
  socket.on('create', function(room) {
    io.emit('chat message', 'Joined Room.')
    socket.room = room;
    socket.join(room);
  });
  
  socket.on('chat', function(data) {
    io.emit('chat message', ('Socket said: ' + data + ' in ' + socket.room));
    io.in(socket.room).emit('chat', data);
  });
  
  socket.on('event', function(data) {
    io.in(socket.room).emit('chat', data);
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
