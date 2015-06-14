// 引入所需模块
var models = require('../models');
var Message = models.Message;
var eventproxy = require('eventproxy');
var UserProxy = require('./user.js');

/*
 * 新建一条通知
 */ 
exports.newAndSave = function(content, sender_id, sender_name, sender_avatar, receiver_id, has_read, callback) {
	var message = new Message();

	message.content = content;
	message.sender_id = sender_id;
	message.sender_name = sender_name;
	message.sender_avatar = sender_avatar;
	message.receiver_id = receiver_id;
	message.has_read = has_read;

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

/*
 * 根据查询条件标记已读消息
 */
exports.markMessageAsReadByQuery = function(id1, id2 , callback) {
	var query = {
		$or: [
			{'receiver_id': id1, 'sender_id': id2, 'has_read': false},
			{'receiver_id': id2, 'sender_id': id1, 'has_read': false}
		]
	}

	// console.log(query);
	Message.update(query, {'has_read': true}, { multi: true }, callback);
}

/*
 * 根据查询条件获取聊天记录
 */ 
exports.getHistoryMessageByQuery = function(query, opt, callback) {
	Message.find(query, {}, opt, callback);
}

/*
 * 根据用户id获取历史聊天对象
 */
exports.getHistoryChatter = function(id, callback) {
	var query = {'receiver_id': id, has_read: false};
	var opt = {sort: '-create_at'};
	var users = {};
	Message.find(query, {}, opt, function(err, messages) {
		if (err) {
			callback(err)
		}
		for (var i = 0;i < messages.length;i++) {
			var userId = messages[i].sender_id;		
			if (!users[userId]) {
				users[userId] = userId;
			}
		}
		callback(null, users, messages.length);
	});
}
