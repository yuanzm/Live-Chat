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
    });

    describe('comment create', function() {
        it('should create a comment successful', function(done) {
            request.post('/' + support.topic._id + '/comment')
            .set('Cookie', support.normalUserCookie)
            .send({
                content: content
            })
            .end(function(err, res) {
                res.status.should.equal(200);
                should.not.exist(err);
                res.text.should.containEql('评论成功');
                done();
            })
        });

        it('should not create a comment when content is empty', function(done) {
            request.post('/' + support.topic._id + '/comment')
            .set('Cookie', support.normalUserCookie)
            .send({
                content: ''
            })
            .end(function(err, res) {
                res.status.should.equal(422);
                should.not.exist(err);
                done();
            });
        });
    });
    describe('comment update', function() {
        it('should not update a comment if operator is not author of the comment', function(done) {
            request.post('/comment/' + support.comment._id + '/update')
            .set('Cookie', support.normalUserCookie)
            .send({
                content: content
            })
            .end(function(err, res) {
                res.status.should.equal(403);
                should.not.exist(err);
                res.text.should.containEql('没有权限');
                done();
            })
        });
        it('should not update a comment if the content is empty', function(done) {
            request.post('/comment/' + support.comment._id + '/update')
            .set('Cookie', support.normalUser2Cookie)
            .send({
                content: ''
            })
            .end(function(err, res) {
                res.status.should.equal(422);
                should.not.exist(err);
                res.text.should.containEql('评论内容不能为空');
                done();
            })
        });

        it('should not update a comment if the comment is not exist', function(done) {
            request.post('/comment/' + 'test_cid' + '/update')
            .set('Cookie', support.normalUser2Cookie)
            .send({
                content: content
            })
            .end(function(err, res) {
                res.status.should.equal(410);
                should.not.exist(err);
                res.text.should.containEql('该评论不存在或者已经删除');
                done();
            })
        });

        it('should update a comment if operator is the author of the topic', function(done) {
            request.post('/comment/' + support.comment._id + '/update')
            .set('Cookie', support.normalUser2Cookie)
            .send({
                content: content
            })
            .end(function(err, res) {
                should.not.exist(err);
                res.status.should.equal(200);
                res.body.message.should.equal('更新成功');
                done();
            })
        });
    });
    describe('comment delete', function() {
        it('should not delete a comment if operator is not author of the comment', function(done) {
            request.post('/comment/' + support.comment._id + '/delete')
            .set('Cookie', support.normalUserCookie)
            .end(function(err, res) {
                res.status.should.equal(403);
                should.not.exist(err);
                res.text.should.containEql('没有权限');
                done();
            })
        });
        it('should not update a comment if the comment is not exist', function(done) {
            request.post('/comment/' + 'test_cid' + '/delete')
            .set('Cookie', support.normalUser2Cookie)
            .end(function(err, res) {
                res.status.should.equal(410);
                should.not.exist(err);
                res.text.should.containEql('评论不存在或者已经删除');
                done();
            })
        });

        it('should delete a comment if operator is the author of the topic', function(done) {
            request.post('/comment/' + support.comment._id + '/delete')
            .set('Cookie', support.normalUser2Cookie)
            .end(function(err, res) {
                should.not.exist(err);
                res.status.should.equal(200);
                res.body.message.should.equal('删除成功');
                done();
            });
        });
    });
});
