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
        this.rpc_params = []
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

    sendJsonRpcResponse(connection, err, msgId, params) {
        var responseMsg = {
            jsonrpc:"2.0",
            error: err,
            id: msgId,
            params: params
        }
        var jsonResponse = JSON.stringify(responseMsg, null, 2)
        if (err) console.log("Send response Error:", jsonResponse)
        connection.sendUTF(jsonResponse);
    }

    serverRequest(err, connection, message) {
        const self = this

        if (err) {
            var errorMsg = {
                code: -32001,
                message: "Receive server request message error:" + err.message,
                data: null
            }
            this.sendJsonRpcResponse(connection, errorMsg, null)
            return
        }

        if (message.type === 'utf8') {

            var rpc_request = null

            /*
            JSON RCP 2.0 error codes
            -32700  Parse error         Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.
            -32600  Invalid Request 	The JSON sent is not a valid Request object.
            -32601  Method not found    The method does not exist / is not available.
            -32602  Invalid params      Invalid method parameter(s).
            -32603  Internal error      Internal JSON-RPC error.
            -32000 to
            -32099	Server error        Reserved for implementation-defined server-errors.
            */

            try {
                rpc_request = JSON.parse(message.utf8Data)
            } catch (e) {
                var errorMsg = {
                    code: -32700,
                    message: "Invalid JSON was received by the server.",
                    data: null
                }
                this.sendJsonRpcResponse(connection, errorMsg, null)
                return
            }

            console.log('rpc_request:', rpc_request)

            if (!rpc_request) {
                // todo: format err response
                var errorMsg = {
                    code: -32600,
                    message: "The JSON sent is not a valid Request object.",
                    data: null
                }
                this.sendJsonRpcResponse(connection, errorMsg, null)
                return
            }

            var msgId = rpc_request.id
            var params = rpc_request.params
            var response = {}
            switch (rpc_request.method) {
                case 'connect':
                    if (self.remote) self.remote.disconnect()
                    params = rpc_request.params[0]
                    self.connect(params.protocol, params.host, params.token, function (err) {
                        response = {
                            message: "Connected to " + host
                        }
                        self.sendJsonRpcResponse(connection, err, msgId, response)
                    })
                    break;
                case 'login':
                    self.login(params.username, params.password, function (err) {
                        response = {
                            message: "Logged into " + host + " as user " + username
                        }
                        self.sendJsonRpcResponse(connection, err, msgId, response)
                    })
                    break;
                case 'config':
                    response = {
                        message: "Proxy server re-configured"
                    }
                    self.sendJsonRpcResponse(connection, null, msgId, response)
                    if (params.export_format) self.export_format = params.export_format
                    break;
                case 'upload':
                    break;
                default:
                    self.rpc(rpc_request, function (err, response) {
                        var errorMsg = null
                        if (err) {
                            errorMsg = {
                                code: -32005,
                                message: "Remote rpc error:"+err.message,
                                data: null
                            }
                        }
                        self.sendJsonRpcResponse(connection, errorMsg, msgId, response)
                    })
            }
        } else if (message.type === 'binary') {
            var errorMsg = {
                code: -32002,
                message: "Binary message received, not supported by service",
                data: null
            }
            this.sendJsonRpcResponse(connection, errorMsg, null)
            return
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
            var errorMsg = {
                code: -32000,
                message: "Not connected to remote host",
                data: null
            }
            cb(errorMsg)
            return
        }
        if (!request.method) {
            var errorMsg = {
                code: -32601,
                message: "Rpc method " + request.method + " not found.",
                data: null
            }
            cb(errorMsg)
            return
        }

        var rpc_params = []
        var stream = null

        if (request.params) {
            rpc_params = request.params.slice(0);
        }
        rpc_params.push(function (err, data) {
            //invoke  rpc consumer callback
            if (!stream) cb(err, data)
        })
        stream = this.remote[request.method].apply(null, rpc_params)
        if (stream && stream.readable) {
            this.captureStreamSync(stream, function (err, data) {
                //invoke  rpc consumer callback
                cb(err, data)
            })
        }
    }
    rpcStream(request, cb) {
        this.rpc(request, cb)
    }
}
