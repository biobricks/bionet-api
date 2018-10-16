"use strict";

global.document = require('./fakeDoc')
const rpc = require('./rpc')
const fs = require('fs');
const proxyService = require('./ProxyService')

module.exports = class BionetClient {
    constructor() {
        this.remote = null
        this.user = null
        this.authToken = null
        this.protocol = 'http'
        this.host = 'localhost:8001'
        this.hostConfig = null
        this.rpc_method = null
        this.rpc_args = []
        this.proxyPort = null
        this.username = null
        this.password = null
        this.import_file = null
        this.export_file = null
        this.export_format = 'json'
    }

    initRpcMethods() {
        this.rpc_methods = {

        }
    }

    connect(protocol, host, authToken, cb) {
        const self = this
        rpc.connect(protocol, host, authToken, function (err, _remote, _user) {
            if (err) {
                self.remote = null
                self.user = null
                if (cb) cb(err)
                return
            }
            self.protocol = protocol
            self.host = host
            self.authToken = authToken
            self.remote = _remote
            self.user = _user
            if (cb) cb(err, _remote, _user)
        })
    }

    reconnect(cb) {
        var self = this

        // if remote, disconnect first
        if (this.remote) {
            this.disconnect(function (err) {
                self.connect(this.protocol, this.host, this.authToken, cb)
            })
        } else {
            self.connect(this.protocol, this.host, this.authToken, cb)
        }
    }

    disconnect(cb) {
        // todo: rpc disconnect method
        this.remote = null
        this.user = null
        cb(null)
    }

    startServer(proxyPort, cb) {
        proxyService.start(proxyPort, this.serverRequest.bind(this), function (err) {
            if (cb) cb(err)
        })
    }

    serverRequest(err, connection, message) {
        const self = this
        if (message.type === 'utf8') {
            function sendResponse(err, msgId, response) {
                var jsonResponse = ""
                if (err) {
                    // todo: format err response
                    err.msgId = msgId
                    var responseMsg = {
                        err:err.message,
                        msgId:msgId,
                        data:null
                    }
                    jsonResponse = JSON.stringify(responseMsg, null, 2)
                } else {
                    var responseMsg = {
                        err:null,
                        msgId:msgId,
                        data:response
                    }
                    jsonResponse = JSON.stringify(responseMsg, null, 2)
                }
                connection.sendUTF(jsonResponse);
            }
            var rpc_request = JSON.parse(message.utf8Data)
            console.log('rpc_request:', rpc_request)
            if (!rpc_request || !rpc_request.method) {
                // todo: format err response
                const err = { err: "rpc method not found" };
                console.log('rpc_request error:', err)
                var jsonResponse = JSON.stringify(err, null, 2)
                connection.sendUTF(jsonResponse);
            } else {
                var params = {}
                var msgId = rpc_request.msgId
                var response = {}
                switch (rpc_request.method) {
                    case 'connect':
                        if (self.remote) self.remote.disconnect()
                        params = rpc_request.args[0]
                        self.connect(params.protocol, params.host, params.token, function (err) {
                            response = {
                                err: err,
                                msg: "connect"
                            }
                            sendResponse(err, msgId, response)
                        })
                        break;
                    case 'login':
                        params = rpc_request.args[0]
                        msgId = rpc_request.msgId
                        self.login(params.username, params.password, function (err) {
                            response = {
                                err: err,
                                msg: "login"
                            }
                            sendResponse(err, msgId, response)
                        })
                        break;
                    case 'config':
                        params = rpc_request.args[0]
                        response = {
                            err: err,
                            msg: "config"
                        }
                        sendResponse(null, msgId, response)
                        if (params.export_format) self.export_format = params.export_format
                        break;
                    case 'upload':
                        break;
                    default:
                        self.rpc(rpc_request, function (err, response) {
                            sendResponse(err, msgId, response)
                        })
                }
            }
        }
        else if (message.type === 'binary') {
            // todo: send error
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    }

    stopServer() { }

    login(username, password, cb) {
        if (!this.remote) {
            cb(Error("Not connected to bionet."))
        }
        const self = this
        rpc.login(this.remote, username, password, function (err, _user, _token) {
            if (err) {
                cb(err)
                return
            }
            self.user = _user
            self.authToken = _token
            cb(err, _user, _token)
        })
    }

    relogin(username, password, cb) {
        //if this.user logout
    }

    captureStreamSync(stream, cb) {
        var resultData = []

        stream.on('error', function (err) {
            console.error(err);
            if (cb) cb(err)
        });

        stream.on('data', function (data) {
            resultData.push(data)
        });

        stream.on('end', function () {
            if (cb) cb(null, resultData)
        });

    }

    rpc(request, cb) {
        if (!this.remote) {
            cb("not connected")
            return
        }
        if (!request.method || !request.args) {
            cb("invalid rpc request")
            return
        }
        var rpc_args = request.args.slice(0);
        rpc_args.push(function (err, data) {
            // todo: check for stream result
            cb(err, data)
        })
        var stream = this.remote[request.method].apply(null, rpc_args)
        if (stream && stream.readable) {
            this.captureStreamSync(stream, function (err, data) {
                cb(err, data)
            })
        }
    }
    rpcStream(request, cb) {
        if (!this.remote) {
            cb("not connected")
            return
        }
        if (!request.method || !request.args) {
            cb("invalid rpc request")
            return
        }
        var rpc_args = request.args.slice(0);
        rpc_args.push(function (err, data) {
            // todo: check for stream result
            if (err) cb(err)
        })
        var stream = this.remote[request.method].apply(null, rpc_args)
        if (stream && stream.readable) {
            this.captureStreamSync(stream, function (err, data) {
                cb(err, data)
            })
        }
    }
}
