chat = require './chat.coffee'

# Initialize varibles
$window = $(window)
$name = $("#my-name").text()
$liveUser = $('#live-user')
$chatList = $('#chat-list')
$chatInput = $('#chat-input')
socket = io()

class Socket
	constructor: ->
	init: ->
		_this = @
		socket.emit "join"
		
		socket.on 'user left', (data)->
			console.log data
		socket.on 'login', (data)->
			console.log data

		socket.on 'message', (data)->
			_this.showMessage data

		_this.bindEvent()
		_this.successSendMessage()
		_this.detectNewUser()

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

	successSendMessage: (data)->
		_this = @
		socket.on 'send message',(data)->
			_this.showMessage data

	detectNewUser: ->
		_this = @
		socket.on 'new user', (data)->
			userNames = data.userNames
			$liveUser.empty()
			for name of userNames
				_this.showNewUser name

	showNewUser: (userName)->
		aUser = '<li>'
		aUser += '<span>' + userName + '</li>'
		aUser += '</li>'

		$liveUser.append $(aUser)

	showMessage: (data) ->
		aChat = '<li>'
		aChat += '<span>' + data.name + '</span>'
		aChat += '<span>' + data.time + '</span>'
		aChat += '<br />'
		aChat += '<span>' + data.message + '</span>'
		aChat += '</li>'

		$chatList.append $(aChat)

module.exports = Socket