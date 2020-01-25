var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  
  socket.on('connect', function(room) {
    socket.join(room);
    io.emit('chat message', 'Connected.')
  });
  
  socket.on('chat message', function(room, data) {
    io.in(room).emit('chat message', data);
  });
  
  socket.on('disconnect', function(room2){
    io.emit('chat message', 'Disconnected.')
    socket.leave(room2);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
