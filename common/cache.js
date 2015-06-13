var redis = require('./redis');
var _     = require('lodash');
var logger = require('./logger');

exports.get = function(key, callback) {
    var t = new Date();
    redis.get(key, function(err, data) {
        if (err) {
            return callback(err);
        }
        if (!data) {
            return callback(null);
        }
        data = JSON.parse(data);
        var duration = (new Date() - t);
        logger.debug('Cache,', 'get', key, (duration + 'ms').green);
        callback(null, data);
    })
};

exports.set = function(key, value, time, callback) {
    var t = new Date();

    if (typeof time === 'function') {
        callback = time;
        time = null;
    }

    callback = callback || _.noop;
    value = JSON.stringify(value);

    if (!time) {
        redis.set(key, value, callback);
    } else {
        redis.setex(key, time, value, callback);
    }
    var duration = (new Date() - t);
    logger.debug('Cache', 'set', key, (duration + 'ms').green);
};

exports.setLive = function(key, o, callback) {
    // console.log(key)
    var cache = [];
    JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null; // Enable garbage collection
    redis.set(key, o, callback);
}

exports.getLive = function(key, callback) {
    // console.log(key)
    redis.get(key, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
}

exports.remove = function(key, callback) {
    redis.del(key, function(err) {
        if (err) {
           callback(err);        
        } else {
            callback(null);
        }
    })
}
