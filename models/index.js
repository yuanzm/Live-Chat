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
require('./comment.js');
require('./group.js');
require('./message.js');
require('./notification.js');
require('./topic.js');
require('./topic_collect.js');

exports.User = mongoose.model('User');
exports.Comment = mongoose.model('Comment');
exports.Group = mongoose.model('Group');
exports.Message = mongoose.model('Message');
exports.Notification = mongoose.model('Notification');
exports.Topic = mongoose.model('Topic');
exports.TopicCollect = mongoose.model('TopicCollect');
