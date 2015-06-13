var app = require('../app');
var request = require('supertest')(app);
var config = require('../config');
var should = require("should");
var pedding = require('pedding');
var support = require('./support/support');

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

	describe('topic up', function() {
		it('up action should be success', function(done) {
            request.post('/topic/' + support.topic._id + '/up')
            .set('Cookie', support.normalUserCookie)
            .expect(200, function(err, res) {
				res.status.should.equal(200);
				res.text.should.containEql('点赞操作成功');
				done();
			})
        })
    });

    describe('topic delete', function() {
    	it('should not delete topic if the operator is not the author of topic', function(done) {
    		request.post('/topic/' + support.topic._id + '/delete')
            .set('Cookie', support.normalUser2Cookie)
            .end(function(err, res) {
            	should.not.exist(err);
            	res.status.should.equal(403);
            	res.body.message.should.equal('没有权限删除该帖子');
            	done();
            })
    	});

    	it('should delete the topic if it is not exist', function(done) {
    		request.post('/topic/' + 'testtid'  + '/delete')
            .set('Cookie', support.normalUserCookie)
            .end(function(err, res) {
            	should.not.exist(err);
            	res.status.should.equal(410);
            	res.body.message.should.equal('帖子不存在或者已经删除');
            	done();
            })
    	});

    	it('should delete topic if the operator is the author of topic', function(done) {
    		request.post('/topic/' + support.topic._id + '/delete')
            .set('Cookie', support.normalUserCookie)
            .end(function(err, res) {
            	should.not.exist(err);
            	res.status.should.equal(200);
            	res.body.message.should.equal('删除成功');
            	done();
            })
    	});
    });

	describe('topic update', function() {
    	it('should not update topic if the operator is not the author of topic', function(done) {
    		request.post('/topic/' + support.topic._id + '/update')
            .set('Cookie', support.normalUser2Cookie)
            .send({
            	title: 'test content',
            	content: 'test content'
            })
            .end(function(err, res) {
            	should.not.exist(err);
            	res.status.should.equal(403);
            	res.body.message.should.equal('没有权限');
            	done();
            })
    	});

    	it('should update the topic if it is not exist', function(done) {
    		request.post('/topic/' + 'testtid'  + '/update')
            .set('Cookie', support.normalUserCookie)
            .send({
            	title: 'test content',
            	content: 'test content'
            })
            .end(function(err, res) {
            	should.not.exist(err);
            	res.status.should.equal(410);
            	res.body.message.should.equal('帖子不存在或者已经删除');
            	done();
            })
    	});

        it('should not update the topic if title is empty', function(done) {
            request.post('/topic/' + support.topic._id + '/update')
            .set('Cookie', support.normalUserCookie)
            .send({
                title: '',
                content: 'test content'
            })
            .end(function(err, res) {
                should.not.exist(err);
                res.status.should.equal(422);
                res.body.message.should.equal('标题或者内容不能为空');
                done();
            })
        });

        it('should not update the topic if content is empty', function(done) {
            request.post('/topic/' + support.topic._id + '/update')
            .set('Cookie', support.normalUserCookie)
            .send({
                title: 'test title',
                content: ''
            })
            .end(function(err, res) {
                should.not.exist(err);
                res.status.should.equal(422);
                res.body.message.should.equal('标题或者内容不能为空');
                done();
            })
        });

    	it('should update topic if the operator is the author of topic', function(done) {
    		request.post('/topic/' + support.topic._id + '/update')
            .set('Cookie', support.normalUserCookie)
            .send({
            	title: 'test content',
            	content: 'test content'
            })
            .end(function(err, res) {
            	should.not.exist(err);
            	res.status.should.equal(200);
            	res.body.message.should.equal('更新成功');
            	done();
            })
    	});
    });
});
