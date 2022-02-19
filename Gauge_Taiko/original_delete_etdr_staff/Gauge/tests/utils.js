"use strict";

const {$} = require('taiko');
const randomstring = require('randomstring');

exports.getEnv = function(param) {
    if (param.startsWith('ENV:')) {
        let paramName = param.split(':')[1];
        param = process.env[paramName];
        exports.message("environment is: "+ param);
    }

    if (param.startsWith('CACHE:')) {
        let key = param.split(':')[1];
        param = gauge.dataStore.specStore.get(key);
        exports.message(key +": "+ param);
    }
    
    return param;
}

exports.transformSelector = function(selector) {
    let result = selector;
    if (selector.startsWith('.')) {
        result = { "class": selector.split('.')[1] };
    }

    if (selector.startsWith('#')) {
        result = { "id": selector.split('#')[1] };
    }

    return result;
}

exports.universalSelector = function(selector) {
    if (selector.startsWith('//') ||
        selector.startsWith('.') ||
        selector.startsWith('#')) {
        selector = $(selector);
    }

    return selector;
}

exports.randomize = function(value) {
    if (value.startsWith('RAND:')) {
        let charset = value.split(':')[1];
        let length = value.split(':')[2];
        let prefix = value.split(':')[3];
        value = randomstring.generate({
            charset: charset,
            length: length
        });

        value = prefix + value;
    }

    return value;
}


// Print to console and write message to the html report too
exports.message = function(message) {
    console.log(message);
    gauge.message(message);
}