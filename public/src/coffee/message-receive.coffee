if location.pathname == "/"
	$chatList = $('#chat-list')
	LiveUser = require './live-user.coffee'
	socket = io()
	$name = $("#my-name")
	$chatPerson = $('#chat-person')
	$chatingUser = $('#chating-user')
	$liveUser = $('#live-user')
	UserDom = require './user-dom.coffee'

	MessageReceive =
		###
		* Bind event handlers for socket
		###
		init: ->
			@detectPrivateMessage()
			@detectMessage()
		###
		* If someone send a group chat message, display it in the chat room 
		###
		detectMessage: ->
			self = @
			socket.on 'message', (messageData)->
				UserDom.showMessage messageData
		###
		* display the unread messages number on user's gravatar
		* @param {Number} index: the position of the user in the chat list
		* @param {Number} num: the number of unread messages
		###
		displayNotice: (displayArea, index, num)->
			aNotice = '<div class="notice">'
			aNotice += '<span class="notice-number">' + num + '</span>'
			aNotice += '</div>'
			displayArea.find('li').eq(index).append($(aNotice))
		###
		* If receive a private message,
		###
		detectPrivateMessage: ->
			self = @
			socket.on 'private message', (data)->
				fromName = data.userName
				if LiveUser.detectIsChatting(fromName)
					if $chatPerson.text() is fromName
						UserDom.showMessage data
					else
						LiveUser.userCollection[fromName].noRead += 1
						index = UserDom.getUserIndex fromName
						self.displayNotice $chatingUser, index, LiveUser.userCollection[fromName].noRead
				else
					index = LiveUser.getUserIndex fromName
					self.displayNotice $liveUser, index, 1
	module.exports = MessageReceive