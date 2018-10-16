#!/usr/bin/env node

"use strict";

const WebSocketClient = require('websocket').client;

module.exports = class BionetClient {
    constructor() {
        this.cbRegistry={}
        this.connection=null
        this.rpcStream=this.rpc
    }
    rpc(rpcRequest,cb) {
        if (this.connection && this.connection.connected) {
            var msgId = Math.random().toString()
            rpcRequest.msgId = msgId
            this.cbRegistry[msgId]=cb
            this.connection.sendUTF(JSON.stringify(rpcRequest));
        } else {
            cb(new Error("not connected to proxy host"))
        }
    }
    connect(proto,host,port,cb) {
        var client = new WebSocketClient();
        const self=this
        client.on('connect', function (connection) {
            console.log('bionet proxy webSocket connected');
            self.connection=connection
            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
                process.exit()
            });
            connection.on('close', function () {
                console.log('bionet proxy connection closed');
                process.exit()
            });
            function onMessage(message) {
                if (message.type === 'utf8') {
                    var jsonMsg = JSON.parse(message.utf8Data)
                    var msgId = jsonMsg.msgId
                    var cbResult = self.cbRegistry[msgId]
                    if (msgId && cbResult) {
                        delete self.cbRegistry[msgId]
                        cbResult(jsonMsg.err,jsonMsg.data)
                    } else {
                        console.log('no msgId:',jsonMsg)
                    }
                } else {
                    console.log("invalid message type received")
                }
            }
            connection.on('message', onMessage)
            if (cb) cb(null,connection)
            return connection
        });
        var wsUrl = proto + host + ":" + port + "/"
        client.connect(wsUrl, 'bionet-protocol');
    }
}
