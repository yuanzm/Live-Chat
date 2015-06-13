var app = require('../app');
var request = require('supertest')(app);
var config = require('../config');
var should = require("should");
var pedding = require('pedding');
var support = require('./support/support');

describe('test/controllers/topic_collect.test.js', function() {
	before(function(done) {
		done = pedding(done, 1);
		support.ready(done);
	});

	describe('topic de_collect', function() {
		it('should not de_collect a topic when it has not be collected before', function(done) {
			request.post('/topic/' + support.topic._id + '/de_collect')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res) {
				res.status.should.equal(410);
				res.text.should.containEql('未收藏不能取消');
				done();
			})
		});
	})

	describe('topic collection add', function() {
		it('should not collect a topic when topic is not exist', function(done) {
			request.post('/topic/' + 'test_topic_id' + '/collect')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res) {
				res.status.should.equal(410);
				res.text.should.containEql('帖子不存在');
				done();
			})
		});

		it('should collect a topic successful', function(done) {
			request.post('/topic/' + support.topic._id + '/collect')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res) {
				res.status.should.equal(200);
				res.text.should.containEql('收藏成功');
				done();
			})
		});

		it('should not collect a topic repeatedly', function(done) {
			request.post('/topic/' + support.topic._id + '/collect')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res) {
				res.status.should.equal(403);
				res.text.should.containEql('不能重复收藏');
				done();
			})
		});

	});
	describe('topic de_collect', function() {
		it('should not collect a topic when topic is not exist', function(done) {
			request.post('/topic/' + 'test_topic_id' + '/de_collect')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res) {
				res.status.should.equal(410);
				res.text.should.containEql('帖子不存在');
				done();
			})
		});

		it('should de_collect a topic successful', function(done) {
			request.post('/topic/' + support.topic._id + '/de_collect')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res) {
				res.status.should.equal(200);
				res.text.should.containEql('取消收藏成功');
				done();
			})
		});
	})
})