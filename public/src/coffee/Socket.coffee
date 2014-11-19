chat = require './chat.coffee'

# Initialize varibles
$window = $(window)
$name = $("#my-name").text()
$userList = $('.user-list')
$chatList = $('#chat-list')
$chatInput = $('#chat-input')
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

		socket.on 'message', (data)->
			$chatList.append('<li>' + data.message + '</li>')

		@bindEvent()
	bindEvent: ->
		_this = @
		$window.keydown (event)->
			if not (event.ctrlKey or event.metaKey or event.altKey)
				$chatInput.focus()

			if event.which is 13
				data =
					time: chat.getTime()
					name: $name
					message: $chatInput.val()
				$chatInput.val('')
				_this.sendMessage(data)

	sendMessage: (data)->
		socket.emit('new message', data)

module.exports = Socket