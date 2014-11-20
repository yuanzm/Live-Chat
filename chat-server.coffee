app = require './app.coffee'
server = require('http').createServer(app)
io = require('socket.io')(server)

sessionConfig = require './session-config.coffee'

io.use (socket, next)->
	req = socket.handshake
	res = {}
	sessionConfig.cookieParser(req, res, (err)->
		if err
			return next(err)
		sessionConfig.sessionStore(req, res, next)
	)

userNames = {}
offlinelist = {}
userNumbers = 0
hopeConnect = null

io.on 'connection', (socket)->
	user = socket.handshake.session.user
	if user
		#判断用户是否登录
		socket.name = user.name
		#相应用户的刷新页面事件
		socket.on 'join',->
			#如果用户在待离线列表中，把该用户从待离线列表中删除
			if offlinelist.hasOwnProperty(socket.name)
				delete offlinelist[socket.name]
				clearTimeout(hopeConnect)
			#如果在线用户列表中不存在该用户，则添加到在线用户列表中
			if userNames.hasOwnProperty(socket.name)
			else
				userNames[socket.name] = socket.name
				++userNumbers
			#向所有socket客户端广播这条此用户的登录信息
			socket.broadcast.emit 'new user',{
				userNames: userNames
				userNumbers: userNumbers
			}

			socket.emit 'success login', {
				userNames: userNames
				userNumbers: userNumbers
			}

		socket.on 'new message', (data)->
			socket.broadcast.emit 'message', data
			socket.emit 'send message', data

	#如果用户没有登录，断开socket连接
	else
		socket.disconnect()

	socket.on 'disconnect', ->
		#防抖操作：用户刷新页面不算离开，关掉页面三秒之后才算离开
		offlinelist[socket.name] = socket.name
		delay = (ms, func) -> setTimeout func, ms
		hopeConnect =  delay 3000, ->
			console.log "welcome back"
			delete userNames[socket.name]
			--userNumbers

			socket.broadcast.emit 'user left', {
				userNames: userNames
				userNumbers: userNumbers
			}


module.exports = (server)->
	io.listen(server)
