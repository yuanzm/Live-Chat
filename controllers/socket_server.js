var cache = require('../common/cache');
var UserProxy = require('../proxy/user');
var MessageProxy = require('../proxy/message');
var eventproxy = require('eventproxy');

liveUser = {};
userSocket = {};
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
				// console.log(socket);
				var key = 'live-' + data.who;
				// cache.setLive(key, socket, function() {
				// 	++userNumbers;					
				// });
				userSocket[name] = socket;
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

		socket.on('chat', function(data) {
			console.log(data);
			var receiver_id = data.to;
			var sender_id = data.who;
			var content = data.msg;
			var ep = new eventproxy();
			var has_read = true;

			// 获得发送方的信息
			UserProxy.getUserById(sender_id, function(err, user) {
				ep.emit('sender-message', user)
			});

			// 当发送方查询完成、消息保存完成、socket客户端查询完成的时候发送消息到接收方
			ep.all('message-save-success', 'sender-message', function(message, sender) {
				userSocket[message.receiver_id].emit('message', {
					who: message.sender_id,
					dowhat: 'chat',
					msg: {
						content: message.content,	// 发送者的名字
						avatar: sender.avatar,		// 发送者的头像
						username: sender.loginname,	// 发送者的昵称 		
					}
				})
			});

			// 获取接收方的在线状态
			UserProxy.getUserById(receiver_id, function(err, user) {
				has_read = user.online ? true : false;
				ep.emit('online-status');
			});

			// 获知接收方是否在线之后才可以保存消息
			ep.on('online-status', function() {
				MessageProxy.newAndSave(content, sender_id, receiver_id, has_read, function(err, message) {
					socket.emit('send-message-success', {
						message: message
					});
					ep.emit('message-save-success', message);
				});
			});
		});

		socket.on('disconnect', function() {
			// 防抖操作：用户刷新页面不算离开，关掉页面三秒之后才算离开
			offlinelist[name] = name;
			delete liveUser[name];
			// cache.remove('live-' + name,function() {
			// 	console.log('delete successful');
			// });
			delete userSocket[name];
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
