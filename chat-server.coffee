app = require './app.coffee'
server = require('http').createServer(app)
io = require('socket.io')(server)

# cookieParser = require('cookie-parser')()
# session    = require('express-session')({secret: 'Live-Chat'})
sessionConfig = require './session-config.coffee'

userNames = {}
userNumbers = 0

io.use (socket, next)->
	req = socket.handshake
	res = {}
	sessionConfig.cookieParser(req, res, (err)->
		if err
			return next(err)
		sessionConfig.sessionStore(req, res, next)
	)


io.on 'connection', (socket)->
	console.log 234234
	socket.on 'new message', (data)->
		console.log data

module.exports = (server)->
	io.listen(server)

