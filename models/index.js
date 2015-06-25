/*
 * models出口文件
 */

var mongoose = require('mongoose');
var config = require('../config.js');

mongoose.connect(config.db, function(err) {
	if (err) {
		console.log('connect to %s error', config.db, err.message);
	}
});

// models
require('./user.js');
require('./message.js');

exports.User = mongoose.model('User');
exports.Message = mongoose.model('Message');
