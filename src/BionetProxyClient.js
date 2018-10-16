#!/usr/bin/env node

"use strict";

const WebSocketClient = require('websocket').client;

module.exports = class BionetClient {
    constructor() {
        this.cbRegistry = {}
        this.connection = null
        this.rpcStream = this.rpc
    }
    rpc(rpcRequest, cb) {
        if (this.connection && this.connection.connected) {
            function getRndInteger(max, min) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            var msgId = getRndInteger(1, 9999999)
            rpcRequest.jsonrpc = "2.0"
            rpcRequest.id = msgId
            this.cbRegistry[msgId.toString()] = cb
            this.connection.sendUTF(JSON.stringify(rpcRequest));
        } else {
            cb(new Error("not connected to proxy host"))
        }
    }
    connect(proto, host, port, cb) {
        var client = new WebSocketClient();
        const self = this
        client.on('connect', function (connection) {
            console.log('bionet proxy webSocket connected');
            self.connection = connection
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
                    var jsonRpcResponse = null
                    try {
                        jsonRpcResponse = JSON.parse(message.utf8Data)
                    } catch (e) {
                        var errorMsg = {
                            code: -32700,
                            message: "Invalid JSON was received by the client.",
                            data: null
                        }
                        console.log('Error:', errorMsg)
                        return
                    }
                    var msgId = jsonRpcResponse.id
                    var cbResult = self.cbRegistry[msgId.toString()]
                    if (msgId && cbResult) {
                        var keepCb = cbResult(jsonRpcResponse.error, jsonRpcResponse.params)
                        if (!keepCb) delete self.cbRegistry[msgId.toString()]
                    } else {
                        console.log('no msgId:', jsonRpcResponse)
                    }
                } else {
                    console.log("invalid message type received")
                }
            }
            connection.on('message', onMessage)
            if (cb) cb(null, connection)
            return connection
        });
        var wsUrl = proto + host + ":" + port + "/"
        client.connect(wsUrl, 'bionet-protocol');
    }
}
