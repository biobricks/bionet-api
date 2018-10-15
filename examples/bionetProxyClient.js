#!/usr/bin/env node

/*
to run, first start bionetProxy:
../src/bionetProxyServer -protocol=https -host=endylab.stanford.edu -listen=8088 -username=xxxx -password=xxxx
*/

const WebSocketClient = require('websocket').client;
const fs = require('fs');

var proto = "ws://"
var host = "localhost"
var port = "8088"
var authToken = null
var hostConfig = null
var proxyHost = null
var proxyProtocol = null
var rpc_method = null
var rpc_args = null
var rpcBatch = null
var username = null
var password = null
var import_file = null
var export_file = null
var export_format = 'json'
var exitWhenDone=false

function getCommandLineArgs() {

    function getParam(value) {
        var data = null
        var pa = value.split('=')
        if (pa.length > 1) {
            data = pa[1]
        }
        return data
    }

    process.argv.forEach(function (val, index, _array) {

        // todo: print params

        if (val.indexOf('-hostConfig') >= 0) {
            hostConfigFile = getParam(val)
            const data = fs.readFileSync(hostConfigFile)
            if (data) {
                hostConfig = JSON.parse(data)
                proxyProtocol = hostConfig.protocol
                proxyHost = hostConfig.host
                authToken = hostConfig.token
            }
        }
        else if (val.indexOf('-protocol') >= 0) {
            proxyProtocol = getParam(val)
        }
        else if (val.indexOf('-host') >= 0) {
            proxyHost = getParam(val)
        }
        else if (val.indexOf('-username') >= 0) {
            username = getParam(val)
        }
        else if (val.indexOf('-password') >= 0) {
            password = getParam(val)
        }
        else if (val.indexOf('-rpc_method') >= 0) {
            rpc_method = getParam(val)
        }
        else if (val.indexOf('-batch') >= 0) {
            var batchFile = getParam(val)
            const data = fs.readFileSync(batchFile)
            if (data) {
                rpcBatch = JSON.parse(data)
            }
        }
        else if (val.indexOf('-import=') >= 0) {
            // todo: generate rpcBatch args from csv
            import_file = getParam(val)
        }
        else if (val.indexOf('-export=') >= 0) {
            // todo: setup export to file
            export_file = getParam(val)
        }
        else if (val.indexOf('-export_format') >= 0) {
            export_format = getParam(val)
        }
        else if (val.indexOf('-rpc_args') >= 0) {
            var rpc_argv = getParam(val)
            rpc_argv = rpc_argv.replace(/`/g, '');
            //todo catch json parse errors
            rpc_args = JSON.parse(rpc_argv)
        }
    });

    // post processing import_file
    if (import_file) {
        const data = fs.readFileSync(import_file)
        //todo: convert data to rpcBatch
    }
}

getCommandLineArgs()

var client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

function sendRpcRequest(rpcRequest, _connection) {
    if (_connection.connected) {
        _connection.sendUTF(JSON.stringify(rpcRequest));
    } else {
        console.log('sendRpcRequest: not connected to proxy host, exiting...')
        process.exit()
    }
}

function run(_connection) {
    if (rpcBatch) {
        rpcBatch.forEach(function (rpc_request) {
            sendRpcRequest(rpc_request, _connection);
        })
    } else {
        var rpcRequest = {
            "method": rpc_method,
            "args": rpc_args
        }
        exitWhenDone=true
        sendRpcRequest(rpcRequest, _connection);
    }
}

client.on('connect', function (connection) {
    console.log('bionet proxy webSocket connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
        process.exit()
    });
    connection.on('close', function () {
        console.log('bionet proxy connection closed');
        process.exit()
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            jsonMsg = JSON.parse(message.utf8Data)
            console.log(JSON.stringify(jsonMsg, null, 2));
        }
        if (exitWhenDone) process.exit()
    });
    run(connection)
});

var wsUrl = proto + host + ":" + port + "/"
client.connect(wsUrl, 'bionet-protocol');
