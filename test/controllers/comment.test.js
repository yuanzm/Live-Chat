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

    describe('comment', function() {
        it('should create a comment successful', function(done) {
            request.post('/' + support.topic._id + '/comment')
            .set('Cookie', support.normalUserCookie)
            .send({
                content: content
            })
            .end(function(err, res) {
                res.status.should.equal(200);
                should.not.exist(err);
                done();
            })
        });
    });
});
