var cache = require('../common/cache');
var UserProxy = require('../proxy/user');
var eventproxy = require('eventproxy');

liveUser = {};
userNumbers = 0;
hopeConnect = null;
offlinelist = {};

exports.chat = function(io) {
	io.on('connection', function (socket) {
		var name = socket.handshake.session.user._id;
		socket.on('login', function(data) {		
			// 如果用户在待离线列表中，把该用户从待离线列表中删除
			// console.log(offlinelist)
			if (offlinelist.hasOwnProperty(name)) {
				delete offlinelist[name]
				clearTimeout(hopeConnect);
			}

			// 如果在线用户列表中不存在该用户，则添加到在线用户列表中
			if (!liveUser.hasOwnProperty(name)) {
				liveUser[name] = name;
				cache.setLive('live-' + data.who, socket, function() {
					++userNumbers;					
				});
			}
			// 告诉所有用户该用户上线了
			UserProxy.getUserById(data.who, function(err, user) {
				socket.broadcast.emit('message', {
					who: data.who,
					user: user,
					dowhat: 'login'
				});
				// 告诉连接端连接成功
				socket.emit('message', {
					dowhat: 'join',
					who: name
				});
			});
		});

		socket.on('get_live_list', function() {
			var length = 0;
			var liveUserArray = [];
			for (var user in liveUser) {
				length++;
			}
			var ep = new eventproxy();
			ep.after('one-user-load', length, function() {
				socket.emit('message', {
					dowhat: 'get_live_list',
					liveUserArray: liveUserArray
				});
			});
			console.log(liveUser);
			for(var name in liveUser) {
				UserProxy.getUserById(liveUser[name], function(err, user) {
					var oneUser = {
						name: user.loginname,
						id: user._id
					}
					liveUserArray.push(oneUser);
					ep.emit('one-user-load');
				})
			}
		});

		socket.on('disconnect', function() {
			// 防抖操作：用户刷新页面不算离开，关掉页面三秒之后才算离开
			offlinelist[name] = name;
			delete liveUser[name];
			cache.remove('live-' + name,function() {
				console.log('delete successful');
			});
			--userNumbers;

			hopeConnect = setTimeout(function() {
				socket.broadcast.emit('message', {
					dowhat: 'logout',
					who: name
				});
			}, 3000);
		})
	});
};
