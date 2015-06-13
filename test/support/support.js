var User = require('../../proxy/user');
var Topic = require('../../proxy/topic');
var Comment = require('../../proxy/comment');
var eventproxy = require('eventproxy');
var tools = require('../../common/tools');
var ready = require('ready');

function randomInit() {
	return (Math.random() * 10000).toFixed(0);
}

var createUser = exports.createUser = function(callback) {
	var key = new Date().getTime() + '_' + randomInit();
	var password = 'yuanzm';
	var passHash = tools.hashString(password);

	User.newAndSave('yuanzm' + key, passHash, 'yuanzm@qq.com' + key, "locaohost" + key, callback);
}

var createTopic = exports.createTopic = function(author_id, callback) {
	var key = new Date().getTime() + '_' + randomInit();

	Topic.newAndSave('testtitle' + key, 'testcontent' + key, author_id, callback);
}

var createComment = exports.createComment = function(topic_id, author_id, callback) {
	var key = new Date().getTime() + '_' + randomInit();

	Comment.newAndSave('test content' + key, topic_id, author_id, undefined, callback);
}

function mockUser(user) {
  return 'mock_user=' + JSON.stringify(user) + ';';
}

ready(exports);

var ep = new eventproxy();
ep.fail(function(err) {
	console.log(err);
});

ep.all('user', 'user2', function(user, user2) {
	exports.normalUser = user;
	exports.normalUserCookie = mockUser(user);
	ep.emit('user-create');

	exports.normalUser2 = user2;
	exports.normalUser2Cookie = mockUser(user2);
	ep.emit('user2-create');

	createTopic(user._id, function(err, topic) {
		ep.emit('topic-create', topic, user2);
	});
});

createUser(function(err, user) {
	ep.emit('user', user)
});

createUser(function(err, user) {
	ep.emit('user2', user);
});

ep.on('topic-create', function(topic, user2) {
	exports.topic = topic;
	createComment(topic._id, user2._id, ep.done('comment-create'))
});

ep.on('comment-create', function(comment) {
	exports.comment = comment;
	exports.ready(true);
});
