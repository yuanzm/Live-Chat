var logger = require("../common/logger");

module.exports = function(req, res, next) {
    if (exports.ignore.test(req.url)) {
        next();
        return;
    }
    var t = new Date();
    logger.log('\nStarted', t.toISOString(), req.method, req.url, req.ip);

    res.on('finish', function() {
        var duration = ((new Date()) - t);

        logger.log('Completed', res.statusCode, ('(' + duration + 'ms)').green);
    });

    next();
}

exports.ignore = /^\/(public|agent)/;
