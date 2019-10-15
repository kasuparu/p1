const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const timestampFileService = require('./src/service/timestamp-file');

const WEB_PORT = 3000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/static/index.html');
});
app.get('/missme', function (req, res) {
  res.sendfile(__dirname + '/static/missme-min.png');
});
timestampFileService.loadTimestamp((error) => {
    if (error) {
        console.error('Error loading timestamp', error);
    }
});

http.listen(WEB_PORT, function () {
    console.info('listening on *: ', WEB_PORT);

    io.on('connection', function (socket) {
        console.debug('Client connected', socket.client.id);
        socket.emit('reset timestamp', timestampFileService.get());

        socket.on('disconnect', function () {
            console.debug('Client disconnected', socket.client.id);
        });

        socket.on('reset timestamp request', function () {
            const now = +new Date();
            console.info('Reset timestamp: ', now, 'by', socket.client.id);
            io.emit('reset timestamp', now);
            timestampFileService.saveTimestamp(now, (error) => {
                if (error) {
                    console.error('Error saving timestamp', error);
                }
            });
        });
    });
});
