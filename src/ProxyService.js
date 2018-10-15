var WebSocketServer = require('websocket').server;
var http = require('http');

function start(port, requestcb, cb) {

    var server = http.createServer(function (request, response) {
        response.writeHead(404);
        response.end();
    });

    server.listen(port, "localhost", function (err) {
        if (cb) cb(err)
    });

    wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
        return true;
    }

    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        // todo: change bionet-protocol to bionet-protocol
        var connection = request.accept('bionet-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function (message) {
            if (requestcb) requestcb(null,connection,message)
        });
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    });

}

module.exports = {
    start: start
}