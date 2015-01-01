if location.pathname == "/"
	# Declare some variables
	$chatingUser = $('#chating-user')
	$chatPerson = $('#chat-person')
	$chatLeft = $('#chat-left')
	$name = $("#my-name")
	$liveUser = $('#live-user')
	$chatsList = $('#chat-list')

	# Load some modules
	Status = require './maintain-chating.coffee'
	LiveUser = require './live-user.coffee'
	UserDom = require './user-dom.coffee'
	LiveChat = require './LiveChat-config.coffee'

	###
	* event handlers be bound to chatting users
	###
	chatingUser =
		###
		* Bind event handlers to users in chatting list by calling some functions
		###
		init: ->
			@clickToDeletePerson()
			@changeChatingPerson()
			@removeChatPerson()
			@getChatList()
		###
		* When login successful or refresh the page,load some datas we need.
		* Firstly, we need to load the chat user list.
		* If there users in the list we loaded just now,
		* show the chat list on the page by adding class `is-chating` to the chatting room.
		* Also, we need to add the users to array `userCollection` which maintain these users' status.
		* Secondly, we also need to get the chatting user,if he exists, mark it in the chat user list.
		* Besides, it is essential to rename the chatting user. 
		###
		getChatList: ->
			name = $name.text()
			self = @
			Status.getChatPersonsData name, (data)->
				isChating = data.isChating
				chatNow = data.chatNow
				if isChating.length
					$chatLeft.addClass('is-chating')
					for user in isChating
						LiveUser.addChatPerson user
						LiveUser.userCollection[user.name] = new LiveUser.OneUser(user.name)
						LiveUser.userCollection[LiveChat.name] = new LiveUser.OneUser(LiveChat.name)
					if chatNow.length
						index = UserDom.getUserIndex(chatNow)
						UserDom.markChatingNowUser index
						self.nameChatingPerson(chatNow)


		###
		* Click the `close button` to the top right corner of the user's avatar to 
		* remove one user from the chat user list.
		###
		clickToDeletePerson: ->
			self = @
			$chatingUser.delegate '.close-chating', 'click', (event)->
				name = $(@).parent().text()
				self.removeChatPerson(name)
				Status.removeUserFromChatList $name.text(), name, (data)->
					
				chatingNum = LiveUser.checkChatingNum()
				if chatingNum is 0
					self.nameChatingPerson('Live-Chat')
					$chatLeft.removeClass('is-chating')
					Status.updateChatingNowPerson $name.text(), LiveChat.name, (data)->
				event.stopPropagation()

		###
		* There are several things need to be executed when click a user in the chat user list
		* Firstly, reset the chatting user at the database level through Ajax.
		* Secondly, rename the chatting user on the page.
		* Thirdly, we need to mark the user we click just now.
		* Fourthly, query the last 20 chats through Ajax.
		* Lastly, repaint the chat room.
		###
		changeChatingPerson: ->
			self = @
			$chatingUser.delegate 'li', 'click', ->
				name = $(@).find('.chat-user-name').text()
				gravatar = $(@).find('img').attr('src')
				Status.updateChatingNowPerson $name.text(), name, (data)->
				self.nameChatingPerson(name)
				index = UserDom.getUserIndex(name)
				UserDom.markChatingNowUser index

				if name is LiveChat.name
					self.loadGroupChat()
				else
					self.loadPrivateChat($name.text(), name, gravatar)
		
		loadGroupChat: ->
			self = @
			group = LiveUser.userCollection[LiveChat.name]
			start = group.getChatStart()
			limit = group.getChatLimit()
			Status.getGroupTwenty start, (data)->
				if data
					# allmessage = self.processData data
					self.repaintChatRoom data
		processData: (messageData, gravatar)->
			allmessage = []
			for chat in messageData
				chatPackage =
					receiverData: {gravatar: gravatar}
					userName: chat.userName
					message: chat.message
				allmessage.push chatPackage
			return allmessage
		###
		* Load history chats from database.
		###
		loadPrivateChat: (myname, name, gravatar)->
			self = @
			chatName = LiveUser.userCollection[name] 
			start = chatName.getChatStart()
			limit = chatName.getChatLimit()
			Status.getTwenty myname, name, start, (start + limit), (data)->
				if data
					allmessage = self.processData(data, gravatar)
					self.repaintChatRoom allmessage				
					chatName.setChatStart(start + limit)
		###
		* Repaint the chat room
		* @param {Array} allmessage: an array contain messages need to be repainted.
		###
		repaintChatRoom: (allMessage)->
			$chatsList.empty()
			for message in allMessage
				UserDom.showMessage message
		###
		* remove a user in chating users list
		###
		removeChatPerson: (name)->
			allChatingUser = $chatingUser.find('li')
			for user in allChatingUser
				if $(user).text() == name
					$(user).remove()
		###
		* display the chating user
		###
		nameChatingPerson: (name)->
			$chatPerson.text(name)



	module.exports = 
		chatingUser: chatingUser