var app = require('../app');
var request = require('supertest')(app);
var config = require('../config');
var should = require("should");
var pedding = require('pedding');
var Notification = require('../common/notification');
var support = require('./support/support');
var NotificationProxy = require('../proxy').Notification;

describe('test/common/notification.js', function() {
	before(function(done) {
        done = pedding(done, 1);
        support.ready(done);
    });

	it('should send collect message', function(done) {
		Notification.sendCollectNotification(support.normalUser._id,support.normalUser2._id, undefined, undefined, function() {
			NotificationProxy.getUnreadNotificationCountById(support.normalUser2._id, function(err, notifications) {
				notifications.length.should.equal(1);
				done();
			})
		})
	});

	it('should send comment message', function(done) {
		Notification.sendCommentNotification(support.normalUser._id,support.normalUser2._id, undefined, undefined, function() {
			NotificationProxy.getUnreadNotificationCountById(support.normalUser2._id, function(err, notifications) {
				notifications.length.should.equal(2);
				NotificationProxy.markAllNotificationAsReadById(support.normalUser2._id);
				done();
			});
		});
	});
});
