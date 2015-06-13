var eventproxy     = require('eventproxy');
var NotificationProxy = require('../proxy').Notification;
var UserProxy = require('../proxy').User;

/*
 * 发送收藏通知
 * - 接受者的未读数加1
 */
exports.sendCollectNotification = function(sender_id, receiver_id, topic_id, comment_id, callback) {
	var type = 'collect';
	NotificationProxy.newAndSave(type, sender_id, receiver_id, topic_id, comment_id, callback);
}

/*
 * 发送评论通知
 */
exports.sendCommentNotification = function(sender_id, receiver_id, topic_id, comment_id, callback) {
	var type = 'comment';
	NotificationProxy.newAndSave(type, sender_id, receiver_id, topic_id, comment_id, callback);
}
