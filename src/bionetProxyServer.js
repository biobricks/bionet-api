#!/usr/bin/env node

"use strict";
global.document = require('./fakeDoc')
const BionetClient = require('./BionetClient.js')
const BionetApi = require('./api/javascript/BionetApi')
const fs = require('fs');
const dataConversionFactory = require('./DataConversionFactory')
const BionetBatchUpload = require('./BionetBatchUpload')

var protocol = 'https'
var host = null
var authToken = null
var hostConfig = null
var genHostConfig = false
var rpc_method = null
var rpc_args = null
var proxyPort = null
var username = null
var password = null
var import_file = null
var import_format = 'json'
var upload_method = null
var upload_container = null
var export_file = null
var export_format = 'json'
var isRunning = false

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
            var hostConfigFile = getParam(val)
            var data=null
            try {
                data = fs.readFileSync(hostConfigFile)
            } catch (e) {
                console.log('error opening host config:'+e)
                process.exit()
            }
            if (!data) return
            hostConfig = JSON.parse(data)
            if (!hostConfig) {
                console.log('invalid host config')
                process.exit()
            }
            protocol = hostConfig.protocol
            host = hostConfig.host
            authToken = hostConfig.token
            if (!protocol || !host || !authToken) {
                console.log('invalid host config parameters')
                process.exit()
            }
            //genHostConfig=true
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
        else if (val.indexOf('-import_file') >= 0) {
            // todo: run importer
            import_file = getParam(val)
        }
        else if (val.indexOf('-import_format') >= 0) {
            import_format = getParam(val)
        }
        else if (val.indexOf('-upload_container') >= 0) {
            upload_container = getParam(val)
        }
        else if (val.indexOf('-upload_method') >= 0) {
            upload_method = getParam(val)
        }
        else if (val.indexOf('-export=') >= 0) {
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

bionetClient.connect(protocol, host, authToken, function (err, _remote, _user) {

    if (err) {
        log("error connecting")
        return
    }

    function run() {
        // todo: figure out why connect is called multiple times
        if (isRunning) return
        isRunning=true
        const bionetApi = new BionetApi(bionetClient)
        function importFile() {
            console.log('import file:',import_format,import_file,upload_container,upload_method)
            var importer = dataConversionFactory(import_format)
            var data = importer.import(import_file, function processResult(err, data) {
                console.log('import file data:',data)
                const batchProcessor = new BionetBatchUpload()
                if (upload_container) {
                    batchProcessor.uploadIntoContainer(upload_method, upload_container, data, bionetApi, function (err, result) {
                        if (err) console.log(err)
                        else {
                            console.log(result.length+" uploaded to "+upload_container)
                            console.log(JSON.stringify(result,null,2))
                        }
                    })
                }
            })
        }
        function sendRpc() {
            const rpcRequest = {
                "method": rpc_method,
                "params": rpc_args,
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
        if (import_file) importFile()
    }

    if (!_user) {
        bionetClient.login(username, password, function (err, _user, _token) {
            authToken = _token
            if (genHostConfig) {
                //console.log("genHostConfig, token:",token,_user)
                const hostConfig = {
                    protocol: protocol,
                    host: host,
                    token: authToken
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
