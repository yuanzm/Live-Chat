var app = require('../app');
var request = require('supertest')(app);
var config = require('../config');
var should = require("should");
var pedding = require('pedding');
var support = require('./support/support');
var Notification = require('../common/notification');

describe('test/controllers/notification.test.js', function(){
	before(function(done) {
        done = pedding(done, 1);
        support.ready(done);
    });
	describe('notification', function() {
		before(function() {
			Notification.sendCollectNotification(support.normalUser._id, support.normalUser2._id, support.topic._id, undefined, function() {
				console.log('collect success');
			});
		});
		it('should', function(done) {
			request.get('/my/notifications')
            .set('Cookie', support.normalUser2Cookie)
            .end(function(err, res) {
                res.status.should.equal(200);
                should.not.exist(err);
                res.text.should.containEql('消息');
                // res.body.pages.should.equal(1);
                // res.body.currentPage.should.equal(1);
                // res.body.unReadList[0].notification.type.should.equal('collect');
                done();
            })
		});
	})
});	
