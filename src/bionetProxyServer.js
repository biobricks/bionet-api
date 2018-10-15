#!/usr/bin/env node

"use strict";
global.document = require('./fakeDoc')
const BionetClient = require('./BionetClient.js')

var protocol = 'https'
var host = null
var token = null
var hostConfig = null
var genHostConfig = false
var rpc_method = null
var rpc_args = null
var proxyPort = null
var username = null
var password = null
var import_file = null
var export_file = null
var export_format = 'json'

const bionetClient = new BionetClient()

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

        // todo: print error message and die if required arguments missing

        if (val.indexOf('-hostConfig') >= 0) {
            hostConfigFile = getParam(val)
            const data = fs.readFileSync(hostConfigFile)
            if (!data) return
            hostConfig = JSON.parse(data)
            protocol = hostConfig.protocol
            host = hostConfig.host
            authToken = hostConfig.token
        }
        else if (val.indexOf('-genHostConfig') >= 0) {
            genHostConfig = true
        }
        else if (val.indexOf('-listen') >= 0) {
            proxyPort = getParam(val)
        }
        else if (val.indexOf('-protocol') >= 0) {
            protocol = getParam(val)
        }
        else if (val.indexOf('-host') >= 0) {
            host = getParam(val)
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
        else if (val.indexOf('-import') >= 0) {
            // todo: run importer
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
}

getCommandLineArgs()

bionetClient.connect(protocol, host, token, function (err, _remote, _user, authToken) {

    if (err) {
        log("error connecting")
        return
    }

    function run() {
        function sendRpc() {
            const rpcRequest = {
                "method": rpc_method,
                "args": rpc_args
            }
            bionetClient.rpc(rpcRequest, function (err, result) {
                // todo: convert to export format
                console.log(JSON.stringify(result, null, 2))
                if (!proxyPort) process.exit()
            })
        }

        function startServer() {
            bionetClient.startServer(proxyPort, function (err) {
                if (err) {
                    console.log('Error starting server on ' + proxyPort);
                } else {
                    console.log((new Date()) + ' Server is listening on port ' + proxyPort);
                }
            })
        }
        if (rpc_method) sendRpc()
        if (proxyPort) startServer()
    }

    if (!_user) {
        bionetClient.login(username, password, function (err, _user, _token) {
            token = _token
            if (genHostConfig) {
                //console.log("genHostConfig, token:",token,_user)
                const hostConfig = {
                    protocol: protocol,
                    host: host,
                    token: token
                }
                console.log(JSON.stringify(hostConfig, null, 2))
                process.exit()
            }
            else run()
        })
    } else {
        run()
    }
})
