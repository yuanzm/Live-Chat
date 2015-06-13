// 引入所需模块
var models = require('../models');
var Message = models.Message;
var eventproxy = require('eventproxy');
var UserProxy = require('./user.js');

/*
 * 新建一条通知
 */ 
exports.newAndSave = function(content, sender_id, receiver_id, callback) {
	var message = new Message();

	message.content = content;
	message.sender_id = sender_id;
	message.receiver_id = receiver_id;

	message.save(callback);
}

/*
 * 标记一个用户的所有消息为已读
 * @param {ObjectId} receiver_id: 需要被更新的用户
 */
exports.markAllMessageAsReadById = function(receiver_id, sender_id, callback) {
	var query = {'receiver_id': receiver_id, 'sender_id': sender_id, 'has_read': false};
	var update = {'has_read': true};
	Message.update(query, update, {}, callback);
}

