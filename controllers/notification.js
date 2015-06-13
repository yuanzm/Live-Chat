var eventproxy     = require('eventproxy');
var validator = require('validator');
var Notification = require('../proxy').Notification;
var config = require('../config');
var UserProxy = require('../proxy').User;

exports.index = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);
	var pages;
	var page = req.params.page || 1;
	var hasReadList = [];
	var unReadList = [];
	var unreadLength;
	var user_id = req.session.user._id;
	var limit = config.list_notification_count;
	var length = 0;

	ep.all('notification-count', 'notifications-load', function(count) {
		res.render('notification', {
			pages: Math.ceil(count / limit),
			currentPage: page,
			hasReadList: hasReadList,
			unReadList: unReadList
		});
	});
	// 统计所有消息数量
	Notification.getNotificationCountById(user_id, function(err, count) {
		ep.emit('notification-count', count);
	});

	var query = {'receiver_id': user_id};
	var opt = {
		limit: 20,
		$skip: limit * (page - 1),
		sort: '-create_at'
	}
	Notification.getNotificationsByQuery(query, opt, function(err, notifications) {
		if (err) {
			return next(err);
		}
		if (!notifications) {
			unreadLength = 0;
			ep.emit('unread-notification');
		}

		length = notifications.length;
		var proxy = new eventproxy();
		proxy.after('one-notifaction-load', length, function() {
			ep.emit('notifications-load');
		});

		for (var i = 0;i < length;i++) {
			var currentNotification = notifications[i];

			Notification.getNotificationRelation(currentNotification, function(err, sender, topic) {
				if (err) {
					return next(err);
				}
				else {
					var oneNotification = {
						notification: currentNotification,
						sender: sender,
						topic: topic
					}
					if (currentNotification.has_read) {
						hasReadList.push(oneNotification);
					} else {
						unReadList.push(oneNotification);
					}
					proxy.emit('one-notifaction-load');
				}
			});
		}
	});
}