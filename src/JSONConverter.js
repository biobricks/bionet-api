"use strict;"

const fs = require('fs');

module.exports = class JSONConverter {
    import(fileName, cb) {
        var data=null
        try {
            data = fs.readFileSync(fileName)
        } catch (e) {
            if (cb) cb(e)
            return
        }
        if (!data) cb(null,null)
        try {
            const jsonData = JSON.parse(data)
            if (cb) cb(null,jsonData)
        } catch (e) {
            if (cb) cb(e)
        }
    }
    export(dataset, cb) {
    }
}