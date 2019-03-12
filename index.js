const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const timestampFileService = require('./src/service/timestamp-file');

const WEB_PORT = 3000;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/static/index.html');
});

timestampFileService.loadTimestamp((error) => {
  console.log(error);
});

http.listen(WEB_PORT, function(){
    console.log('listening on *: ' + WEB_PORT);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.emit('reset timestamp', timestampFileService.get());

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('reset timestamp request', function(msg){

            const now = + new Date();
            console.log('reset timestamp: ' + now);
            io.emit('reset timestamp', now);
            timestampFileService.saveTimestamp(now, (error) => {
              console.log(error);
            });
        });
    });
});
