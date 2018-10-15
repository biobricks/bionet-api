"use strict;"

const parse = require('csv-parse')
const stringify = require('csv-stringify')
const fs = require('fs');

module.exports = class CSVConverter {

    import(fileName, cb) {

        const output = []

        // Create the parser
        const parser = parse({
            delimiter: ','
        })
    
        // Use the readable stream api
        parser.on('readable', function () {
            let record
            while (record = parser.read()) {
                output.push(record)
            }
        })
    
        // Catch any error
        parser.on('error', function (err) {
            console.error(err.message)
            if (cb) cb(err)
        })
    
        // When we are done, test that the parsed output matched what expected
        parser.on('end', function () {
            if (cb) cb(null, output)
        })
    
        var lineReader = require('readline').createInterface({
            input: fs.createReadStream(fileName)
        });
    
        lineReader.on('line', function (line) {
            parser.write(line.concat('\n'))
        });
    
        lineReader.on('close', function (line) {
            // Close the readable stream
            parser.end()
        });
    }

    export(dataset, cb) {
    }
}
