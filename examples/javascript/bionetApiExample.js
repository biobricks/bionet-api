"use strict";
const fs = require('fs');
const BionetClient = require('../../src/BionetClient.js')
const BionetApi = require('../../src/api/javascript/BionetApi.js')

var protocol = null
var host = null
var token = null
var hostConfig = null
var rpc_method = null
var rpc_args = null
var proxyPort = "8088"
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
            var hostConfigFile = getParam(val)
            const data = fs.readFileSync(hostConfigFile)
            if (!data) return
            hostConfig = JSON.parse(data)
            protocol = hostConfig.protocol
            host = hostConfig.host
            token = hostConfig.token
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

bionetClient.connect(protocol, host, token, function (err, _remote, _user) {

    if (err) {
        log("Error connecting:",err)
        return
    }

    function run() {
        const bionetApi = new BionetApi(bionetClient)
        bionetApi.searchVirtuals("r",{},function(err,result){
            console.log('result:',result)
        })
        bionetApi.get("v-119cb9eb-5eb4-4394-a7db-df7756953526",function(err,result){
            console.log('result:',result)
        })
    }

    if (!_user) {
        bionetClient.login(username, password, function (err, _user, _token) {
            token = _token
            run()
        })
    } else {
        run()
    }
})
