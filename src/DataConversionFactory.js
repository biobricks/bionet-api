"use strict";

const CSVConverter = require('./CSVConverter')
const JSONConverter = require('./JSONConverter')

module.exports = function (format) {
    switch (format) {
        case 'CSV':
        case 'csv':
            return new CSVConverter()
        case 'JSON':
        case 'csv':
            return new JSONConverter()
    }
    return null
}