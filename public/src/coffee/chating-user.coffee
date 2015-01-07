###
* A module to process the chat user list 
###
if location.pathname == "/"
	# Declare some variables
	$chatingUser = $('#chating-user')
	$chatPerson = $('#chat-person')
	$chatLeft = $('#chat-left')
	$name = $("#my-name")
	$liveUser = $('#live-user')
	$chatsList = $('#chat-list')
	$gravatar = $('#gravatar')

	# Load some modules
	Status = require './maintain-chating.coffee'
	LiveUser = require './live-user.coffee'
	UserDom = require './user-dom.coffee'
	LiveChat = require './LiveChat-config.coffee'
	LoadChats = require './chats.coffee'

	LoadChats.loadMore()
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
				LiveUser.userCollection[LiveChat.name] = new LiveUser.OneUser(LiveChat.name)
				if isChating.length
					$chatLeft.addClass('is-chating')
					for user in isChating
						LiveUser.addChatPerson user
						LiveUser.userCollection[user.name] = new LiveUser.OneUser(user.name)
					if chatNow.length
						index = UserDom.getUserIndex(chatNow)
						UserDom.markChatingNowUser index
						self.nameChattingPerson(chatNow)

						if chatNow is LiveChat.name
							LoadChats.loadGroupChat(true)
						else
							LoadChats.loadPrivateChat(chatNow, true)
				else

					LoadChats.loadGroupChat(true)

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
					self.nameChattingPerson('Live-Chat')
					$chatLeft.removeClass('is-chating')
					Status.updateChatingNowPerson $name.text(), LiveChat.name, (data)->
				event.stopPropagation()

		getSelfGravatar: ->
			return $gravatar.attr('src')
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
				chatNow = self.getChattingPerson()
				if chatNow isnt name
					Status.updateChatingNowPerson $name.text(), name, (data)->
					self.nameChattingPerson(name)
					index = UserDom.getUserIndex(name)
					UserDom.markChatingNowUser index
					status = self.getChatStatus(name)

					if name is LiveChat.name
						LoadChats.loadGroupChat(true)
					else
						LoadChats.loadPrivateChat(name, true)
					UserDom.removeNotice($chatingUser,name)
					LiveUser.userCollection[name].setNoRead(0)

					# UserDom.scrollToBottom()
					$('#chat-room').mCustomScrollbar('scrollTo',"bottom")

		getChatStatus: (name)->
			chatName = LiveUser.userCollection[name] 
			return status =
				start:  chatName.getChatStart()
				limit: chatName.getChatLimit()

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
		nameChattingPerson: (name)->
			$chatPerson.text(name)
		###
		* Get chatting user
		###
		getChattingPerson: ->
			return $chatPerson.text()
	module.exports = 
		chatingUser: chatingUser