app = require './app.coffee'
server = require('http').createServer(app)
io = require('socket.io')(server)

io.on 'connection', (socket)->
	console.log "yuanzm zhendiao"

module.exports = (server)->
	io.listen(server)

