var User = require('../../proxy/user');
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

	exports.ready(true);

});

createUser(function(err, user) {
	ep.emit('user', user)
});

createUser(function(err, user) {
	ep.emit('user2', user);
});
