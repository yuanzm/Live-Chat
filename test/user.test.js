var app = require('../app');
var request = require('supertest')(app);
var config = require('../config');
var should = require("should");
var mm = require('mm');
var pedding = require('pedding');
var support = require('./support/support');

describe('test/controllers/user.test.js', function() {
	var male = 'male';
	var wechat = 'yuanzm';
	var qq = '12345678';
	var location = 'China';
	var avatar = 'https://avatars1.githubusercontent.com/u/6168796?v=3&s=40'
	var name = '袁梓民';
	var signature = 'such is life';

	var testUser;
	before(function(done) {
		done = pedding(done, 2);
		support.ready(done);
		support.createUser(function(err, user) {
			testUser = user;
			done(err);
		})
	})

	describe('setting', function() {
		it('should visit setting page', function(done) {
			request.get('/setting')
			.expect(200, function(err, res) {
				should.not.exist(err);
				res.text.should.containEql('Fuck');
				done(err);
			});
		});
		
		it('should update settings successful', function(done) {
			request.post('/setting')
			.set('Cookie', support.normalUserCookie)
			.send({
				male: male,
				wechat: wechat,
				qq: qq,
				location: location,
				avatar: avatar,
				name: name,
				signature: signature
			})
			.expect(200, function(err, res) {
				res.status.should.equal(200);
				res.text.should.containEql('设置成功');
				done();
			})
		})
	});

	describe('user index', function() {
		it('should visit 404page if user not exist', function(done) {
			request.get('/user' + '/testUser')
			.expect(404)
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(404);
				done();
			})
		});
		before(function() {
			console.log(support.normalUser._id)
		})
		it('should visit user page', function(done) {
			request.get('/user/' + support.normalUser.loginname)
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
				res.text.should.containEql('个人中心');
				done();
			})
		})
	});

	describe('user collection list', function() {
		it('should visit 404 page if user not exist', function(done) {
			request.get('/user/testUser/collections')
			.expect(404)
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(404);
				done();
			})
		});
		it('should visit user collection page', function(done) {
			request.get('/user/' + support.normalUser.loginname + '/collections')
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
				res.text.should.containEql('收藏');
				done();
			})
		})
	});

	describe('user comments list', function() {
		it('should visit 404 page if user not exist', function(done) {
			request.get('/user/testUser/comments')
			.expect(404)
			.end(function(err, res) {
				should.not.exist(err);
				res.status.should.equal(404);
				done();
			})
		})
		it('should visit user comments page with no query', function(done) {
			request.get('/user/' + support.normalUser.loginname + '/comments')
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
				res.text.should.containEql('评论');
				done();
			});
		});
		it('should should visit comments page with query string `page` 1', function(done) {
			request.get('/user/' + support.normalUser.loginname + '/comments')
			.expect(200)
			.end(function(err, res) {
				should.not.exist(err);
				res.text.should.containEql('评论');
				done();
			})
		})
	});
});
