"use strict";

process.title = 'node-chat';
var serverPort = 1337;

var webSocketServer = require('websocket').server;
var http = require('http');

var history = new Array();
var clients = new Array();

var colors = [ 'red', 'green', 'blue', 'magenta', 'purple' ];

colors.sort(function(a,b) { return Math.random() > 0.5; } );

var server = http.createServer(function(request, response) {});
server.listen(serverPort, function() {
    console.log((new Date()) + " Server is listening on port " + serverPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin); 
    var index = clients.push(connection) - 1;
    var userName = false;
    var userColor = false;

    console.log((new Date()) + ' Connection accepted.');

    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            if (userName === false) {
                userName = message.utf8Data;
                userColor = colors.shift();
                connection.sendUTF(JSON.stringify({ type:'color', data: userColor }));

                var obj = {
                    time: (new Date()).getTime(),
                    text: userName + " joined to chat room.",
                    author: null,
                    color: null
                };
                history.push(obj);

                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }

            } else {

                var obj = {
                    time: (new Date()).getTime(),
                    text: message.utf8Data,
                    author: userName,
                    color: userColor
                };
                history.push(obj);

                var json = JSON.stringify({ type:'message', data: obj });
                for (var i=0; i < clients.length; i++) {
                    clients[i].sendUTF(json);
                }
            }
        }
    });

    connection.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
            clients.splice(index, 1);
            colors.push(userColor);
        }
    });
});