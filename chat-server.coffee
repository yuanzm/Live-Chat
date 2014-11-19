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
userNumbers = 0

io.on 'connection', (socket)->
	user = socket.handshake.session.user
	if user
		socket.on 'join', (data)->
			socket.broadcast.emit 'new user',{
				userNames: userNames
				userNumbers: userNumbers
			}
	else
		socket.disconnect()
	socket.on 'new message', (data)->
		console.log data

module.exports = (server)->
	io.listen(server)
