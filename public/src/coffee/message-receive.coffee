if location.pathname == "/"
	$chatList = $('#chat-list')
	LiveUser = require './live-user.coffee'
	socket = io()
	$name = $("#my-name")
	$chatPerson = $('#chat-person')
	$chatingUser = $('#chating-user')
	$liveUser = $('#live-user')
	UserDom = require './user-dom.coffee'
	LiveChat = require './LiveChat-config.coffee'

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
				chatNow = UserDom.getChattingNow()
				if chatNow isnt LiveChat.name
					self.addNotice LiveChat.name
				else
					UserDom.showMessage messageData

		###
		* display the unread messages number on user's gravatar
		* @param {Number} index: the position of the user in the chat list
		* @param {Number} num: the number of unread messages
		###
		displayNotice: (name, displayArea, num)->
			index = UserDom.getUserIndex name
			console.log index
			aNotice = '<div class="notice">'
			aNotice += '<span class="notice-number">' + num + '</span>'
			aNotice += '</div>'
			displayArea.find('li').eq(index).append($(aNotice))
		
		addNotice: (name)->
			LiveUser.userCollection[name].noRead += 1
			index = UserDom.getUserIndex name
			@displayNotice name, $chatingUser, LiveUser.userCollection[name].noRead

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
						self.displayNotice fromName, $chatingUser, LiveUser.userCollection[fromName].noRead
				else
					self.displayNotice fromName, $liveUser, 1
	module.exports = MessageReceive