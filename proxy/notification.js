// 引入所需模块
var models = require('../models');
var Notification = models.Notification;
var eventproxy = require('eventproxy');
var UserProxy = require('./user.js');
var TopicProxy = require('./topic');

/*
 * 新建一条通知
 */ 
exports.newAndSave = function(type, sender_id, receiver_id, topic_id, comment_id, callback) {
	var notification = new Notification();

	notification.type = type;
	notification.sender_id = sender_id;
	notification.receiver_id = receiver_id;
	notification.topic_id = topic_id;
	notification.comment_id = comment_id;

	notification.save(callback);
}

/*
 * 根据用户id获取一个用户未读的消息
 * @param {ObjectId} receiver_id: 用户的id
 */
exports.getUnreadNotificationCountById = function(receiver_id, callback) {
	Notification.find({'receiver_id': receiver_id, 'has_read': false}, callback);
}

/*
 * 根据用户id获取一个用户已经读取的消息
 * @param {ObjectId} receiver_id: 用户的id
 */
exports.getHasReadNotificationCountById = function(receiver_id, callback) {
	Notification.find({'receiver_id': receiver_id, 'has_read': false}, callback);	
}

/*
 * 根据查询条件获取一个用户的已读消息
 * @param {ObjectId} receiver_id: 需要被更新的用户
 */
exports.getHasReadNotificationByQuery = function(query, opt, callback) {
	Notification.find(query, {}, opt, callback);
}

/*
 * 标记一个用户的所有消息为已读
 * @param {ObjectId} receiver_id: 需要被更新的用户
 */
exports.markAllNotificationAsReadById = function(receiver_id, callback) {
	var query = {'receiver_id': receiver_id, 'has_read': false};
	var update = {'has_read': true};
	Notification.update(query, update, {}, callback);
}

/*
 * 获取一个用户的所有消息数量
 * @param {ObjectId} receiver_id: 用户id
 */
exports.getNotificationCountById = function(receiver_id, callback) {
	Notification.count({'receiver_id': receiver_id}, callback);
}


exports.getNotificationsByQuery = function(query, opt, callback) {
	Notification.find(query, {}, opt, callback);
}

/*
 * 获取一条通知相关的用户、话题、评论
 */
exports.getNotificationRelation = function(notification, callback) {
	var ep = new eventproxy();
	ep.fail(callback);

	ep.all('sender', 'topic', function(sender, topic) {
		callback(null, sender, topic);
	});

	UserProxy.getUserById(notification.sender_id, ep.done('sender'));
	if (notification.topic_id) {
		TopicProxy.getTopic(notification.topic_id, ep.done('topic'));
	} else {
		ep.emit('topic', null);
	}
}
