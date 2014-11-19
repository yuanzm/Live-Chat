chat = require './chat.coffee'

$name = $("#my-name").text()
userList = $('.user-list')
socket = io()

class Socket
	constructor: ->
	init: ->
		socket.emit "join"
		socket.on 'new user', (data)->
			console.log data
		socket.on 'user left', (data)->
			console.log data
		socket.on 'login', (data)->
			console.log data

module.exports = Socket