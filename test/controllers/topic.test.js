var app = require('../../app');
var request = require('supertest')(app);
var config = require('../../config');
var should = require("should");
var pedding = require('pedding');
var support = require('./../support/support');

describe('test/controllers/topic.test.js', function() {
	var content = 'test content';
	var title = 'test title';

	before(function(done) {
		done = pedding(done, 1);
		support.ready(done);
	})

	describe('create topic', function() {
		it('should create a topic successful', function(done) {
			request.post('/topic/create')
			.set('Cookie', support.normalUserCookie)
			.send({
				title: title,
				content: content
			})
			.expect(200, function(err, res) {
				res.status.should.equal(200);
				res.text.should.containEql('成功');
				done();
			})
		});

		it('should not create a topic when the title is empty', function(done) {
			request.post('/topic/create')
			.set('Cookie', support.normalUserCookie)
			.send({
				title: '',
				content: content
			})
			.expect(200, function(err, res) {
				res.status.should.equal(422);
				done();
			})
		})
		it('should not create a topic when the content is empty', function(done) {
			request.post('/topic/create')
			.set('Cookie', support.normalUserCookie)
			.send({
				title: title,
				content: ''
			})
			.expect(200, function(err, res) {
				res.status.should.equal(422);
				done();
			})
		})
	});
});

