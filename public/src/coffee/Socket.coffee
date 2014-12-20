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
	$gravatar = $('#gravatar')
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
			socket.emit 'join', $gravatar.attr('src')

		successionLoginMessage: ->
			_this = @
			socket.on 'success login', (data)->
				allUser = data.allUser
				_this.freshUser allUser
				_this.showUserNumber data.userNumbers
		#send message detail and sender's user data
		sendMessage: (data)->
			userData = 
				name: $chatPerson.text()
				gravatar: $gravatar.attr('src')
			data.userData = userData
			if chatPerson is 'Live-Chat'
				socket.emit 'new message', messageData
			else
				socket.emit 'private chat', messageData
		successSendMessage: ->
			_this = @
			socket.on 'send message',(messageData)->
				_this.showMessage messageData

		detectMessage: ->
			_this = @
			socket.on 'message', (messageData)->
				_this.showMessage messageData

		detectPrivateMessage: ->
			_this = @
			socket.on 'private message', (data)-> 
				alert data.userName + '对你说' + data.message

		detectNewUser: ->
			_this = @
			socket.on 'new user', (data)->
				allUser = data.allUser
				_this.freshUser allUser
				_this.showUserNumber data.userNumbers
		# when an user leave chat room,delete the user in the page
		detectUserLeft: ->
			_this = @
			socket.on 'user left', (data)-> 
				allUser = data.allUser
				_this.freshUser allUser
				_this.showUserNumber data.userNumbers
		#show all the users live
		freshUser: (allUser)->
			_this = @
			$liveUser.empty()
			for user,userData of allUser
				_this.showNewUser userData

		#display all the users live
		showNewUser: (userData)->
			aUser = '<li>'
			aUser += '<img class="gravatar" src="'
			aUser += userData.gravatar
			aUser += '">' 
			aUser += '<span>' + userData.name + '</span>'
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