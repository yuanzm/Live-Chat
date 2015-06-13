var app = require('../app');
var request = require('supertest')(app);
var config = require('../config');
var should = require("should");
var pedding = require('pedding');
var support = require('./support/support');
var mm = require('mm');
var store = require('../common/store');

describe('#upload', function () {
    it('should upload a file', function (done) {
        mm(store, 'upload', function (file, options, callback) {
            callback(null, {
                url: 'upload_success_url'
            });
        });
        request.post('/upload')
        .attach('selffile', __filename)
        .set('Cookie', support.normalUser2Cookie)
        .end(function (err, res) {
            res.body.should.eql({"success": true, url: 'upload_success_url'});
            done(err);
        });
    });
});
