var UserProxy = require('../proxy/user');
var MessageProxy = require('../proxy/message');
var eventproxy = require('eventproxy');
var config = require('../config');

liveUser = {};
userSocket = {};
userNumbers = 0;
hopeConnect = null;
offlinelist = {};

exports.chat = function(io) {
	io.on('connection', function (socket) {
		var name;
		socket.on('login', function(data) {
			name = socket.handshake.session.user._id;
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
				user.online = true;
				user.save();
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
			// console.log(liveUser);
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
			// console.log(data);
			var receiver_id = data.to;
			var sender_id = data.who;
			var content = data.msg;
			var sender_name = data.sender_name;
			var sender_avatar = data.sender_avatar;
			var ep = new eventproxy();
			var has_read = false;
			var type = data.type;

			// 获得发送方的信息
			UserProxy.getUserById(sender_id, function(err, user) {
				ep.emit('sender-message', user)
			});

			// 当发送方查询完成、消息保存完成、socket客户端查询完成的时候发送消息到接收方
			ep.all('receiver-status','message-save-success', 'sender-message', function(receicer,message, sender) {
				var data = {
					who: message.sender_id,
					dowhat: 'chat',
					msg: {
						content: message.content,	// 发送者的名字
						avatar: sender.avatar,		// 发送者的头像
						username: sender.loginname,	// 发送者的昵称 		
					}
				}
				if (type === 'chat') {
					// console.log(sender)
					if (receicer.online) {
						userSocket[message.receiver_id].emit('message', data)
					}
				} else {
					data.who = config.group_chat_id;
					socket.broadcast.emit('message', data);
				}
			});

			// 获知接收方是否在线之后才可以保存消息
			ep.on('online-status', function() {
				MessageProxy.newAndSave(content, sender_id, sender_name, sender_avatar, receiver_id, has_read, function(err, message) {
					socket.emit('send-message-success', {
						message: message
					});
					ep.emit('message-save-success', message);
				});
			});

			if (type === 'chat') {
				// 获取接收方的在线状态
				UserProxy.getUserById(receiver_id, function(err, user) {
					has_read = user.online ? true : false;
					ep.emit('online-status', user);
					ep.emit('receiver-status', user);
				});
			} else {
				ep.emit('online-status');
				ep.emit('receiver-status', {
					online: true
				});			
			}
		});
		
		socket.on('load_clear_unread_chat_msg', function(data) {
			var receiver_id = data.who;
			var sender_id = data.to;
			var query = {
				$or: [
					{'receiver_id': receiver_id, 'sender_id': sender_id},
					{'receiver_id': sender_id, 'sender_id': receiver_id}
				]
			}
			var opt = {limit: 20, sort: '-create_at'};

			MessageProxy.markMessageAsReadByQuery(receiver_id, sender_id, function() {
				console.log('update success');
			});

			MessageProxy.getHistoryMessageByQuery(query, opt, function(err, messages) {
				UserProxy.getUserById(sender_id, function(err, user) {
					socket.emit('message', {
						dowhat: 'chat_log',
						id: sender_id,
						online: user.online,
						messages: messages.reverse()
					});
				});
			});
		});

		socket.on('clear_group_msg', function(data) {
			var query = {'receiver_id': config.group_chat_id}
			var opt = {limit: 20, sort: '-create_at'};

			MessageProxy.getHistoryMessageByQuery(query, opt, function(err, messages) {
				socket.emit('message', {
					dowhat: 'chat_log',
					id: config.group_chat_id,
					online: true,
					messages: messages.reverse()
				});
			});
		});

		socket.on('get_chat_list', function(data) {
			console.log('data', data);
			var id = data.who;
			MessageProxy.getHistoryChatter(id, function(err, users, count) {
				if (err) {}
				// console.log('history:',users);
				var ep = new eventproxy();
				var length = 0;
				var contacts = [];
				var oneContact;

				for (var user in users) {
					length++;
				}
				// 查询到所有聊天对象的时候发送给客户端
				ep.after('one-history-user-load', length, function() {
					socket.emit('message', {
						dowhat: 'get_chat_list',
						contacts: contacts,
						total_new_msg_count: count
					})
				});

				for(var key in users) {
					UserProxy.getUserById(key, function(err, user) {
						var query = {'sender_id': user._id, 'receiver_id': id, 'has_read': false}
						MessageProxy.getHistoryMessageByQuery(query, {}, function(err, unreadMessages) {
							oneContact = {
								username: user.loginname,
								id: user._id,
								new_msg_count: unreadMessages.length,
								online: user.online,
								avatar: user.avatar
							};
							contacts.push(oneContact);
							ep.emit('one-history-user-load');
						})
					});					
				}
			})
		});

		socket.on('disconnect', function() {
			// 防抖操作：用户刷新页面不算离开，关掉页面三秒之后才算离开
			// console.log('name11111111111111',name);
			offlinelist[name] = name;
			delete liveUser[name];
			delete userSocket[name];
			--userNumbers;
			UserProxy.getUserById(name, function(err, user) {
				console.log(user.online);
				user.online = false;
				user.save(function(err, newuser) {
					socket.handshake.session.user.online = false;
					// console.log('new user', newuser.online);
				});
			})

			hopeConnect = setTimeout(function() {
				socket.broadcast.emit('message', {
					dowhat: 'logout',
					who: name
				});
			}, 3000);
		})
	});
};
