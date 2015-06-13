var app = require('../../app');
var request = require('supertest')(app);
var config = require('../../config');
var should = require("should");
var mm = require('mm');
var pedding = require('pedding');
var support = require('./../support/support');

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
});
