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

		_this.loginMessage()
		_this.keyDownEvent()
		_this.successSendMessage()
		_this.detectNewUser()
		_this.successionLoginMessage()
		_this.detectUserLeft()
		_this.detectMessage()

	keyDownEvent: ->
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

				$.ajax({
					type: "POST"
					url: '/addChat'
					data: data
				})
	loginMessage: ->
		socket.emit 'join'

	successionLoginMessage: ->
		_this = @
		socket.on 'success login', (data)->
			userNames = data.userNames
			_this.freshUser userNames
	sendMessage: (data)->
		socket.emit('new message', data)

	successSendMessage: (data)->
		_this = @
		socket.on 'send message',(data)->
			_this.showMessage data

	detectMessage: ->
		_this = @
		socket.on 'message', (data)->
			_this.showMessage data

	detectNewUser: ->
		_this = @
		socket.on 'new user', (data)->
			userNames = data.userNames
			_this.freshUser userNames

	detectUserLeft: ->
		_this = @
		socket.on 'user left', (data)->
			userNames = data.userNames
			_this.freshUser userNames

	freshUser: (userNames)->
		_this = @
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