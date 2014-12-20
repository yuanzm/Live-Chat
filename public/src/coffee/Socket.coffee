changeuser = require './changeuser.coffee'

if location.pathname == "/"
	chat = require './chat.coffee'

	# Initialize varibles
	$window = $(window)
	$name = $("#my-name")
	$liveUser = $('#live-user')
	$chatList = $('#chat-list')
	$chatInput = $('#chat-input')
	$chatPerson = $('#chat-person')
	$liveNumber = $('#live-number')
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
			_this.detectPrivateMessage()

			changeuser.clickPerson()
			changeuser.clickToDeletePerson()
			changeuser.changeChatingPerson()

		keyDownEvent: ->
			_this = @
			$window.keydown (event)->
				if not (event.ctrlKey or event.metaKey or event.altKey)
					$chatInput.focus()

				if event.which is 13
					data =
						time: chat.getTime()
						userName: $name.text()
						message: $chatInput.val()
					$chatInput.val('')
					_this.sendMessage(data)
					$.ajax({
						type: "POST"
						url: '/addChat'
						data: data
						success: (data)->				
					})
		loginMessage: ->
			socket.emit 'join'

		successionLoginMessage: ->
			_this = @
			socket.on 'success login', (data)->
				userNames = data.userNames
				_this.freshUser userNames
				_this.showUserNumber data.userNumbers
		sendMessage: (data)->
			chatPerson = $chatPerson.text()
			data.name = chatPerson
			if chatPerson is 'Live-Chat'
				socket.emit('new message', data)
			else
				socket.emit 'private chat', data
		successSendMessage: (data)->
			_this = @
			socket.on 'send message',(data)->
				_this.showMessage data

		detectMessage: ->
			_this = @
			socket.on 'message', (data)->
				_this.showMessage data

		detectPrivateMessage: ->
			_this =@
			socket.on 'private message', (data)-> 
				alert data.userName + '对你说' + data.message

		detectNewUser: ->
			_this = @
			socket.on 'new user', (data)->
				userNames = data.userNames
				_this.freshUser userNames
				_this.showUserNumber data.userNumbers
		# when an user leave chat room,delete the user in the page
		detectUserLeft: ->
			_this = @
			socket.on 'user left', (data)->
				userNames = data.userNames
				_this.freshUser userNames
				_this.showUserNumber data.userNumbers
		#show all the users live
		freshUser: (userNames)->
			_this = @
			$liveUser.empty()
			for name of userNames
				_this.showNewUser name

		#display all the users live
		showNewUser: (userName)->
			aUser = '<li>'
			aUser += '<span>' + userName + '</li>'
			aUser += '</li>'

			$liveUser.append $(aUser)
		showUserNumber: (num)->
			$liveNumber.text(num)
		#display  new message
		showMessage: (data) ->
			aChat = '<li>'
			aChat += '<span>' + data.userName + '</span>'
			aChat += '<span>' + data.time + '</span>'
			aChat += '<br />'
			aChat += '<span>' + data.message + '</span>'
			aChat += '</li>'

			$chatList.append $(aChat)

	module.exports = Socket