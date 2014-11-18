app = require './app.coffee'
debug = require('debug')('Live-Chat')

app.set 'port', process.env.PORT or 3000

server = app.listen app.get('port'), ->
	debug 'Live-Chat ' + server.address().port