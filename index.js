var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  io.emit('chat message', 'New Socket Connected.')
  
  socket.on('connect', function(room) {
    io.emit('chat message', 'Joined Room.')
    socket.join(room);
  });
  
  socket.on('chat message', function(room, data) {
    io.in(room).emit('chat message', data);
  });
  
  socket.on('disconnect', function(room2){
    io.emit('chat message', 'Left Room.')
    socket.leave(room2);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
