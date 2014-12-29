if location.pathname == "/"
	$chatingUser = $('#chating-user')
	$chatPerson = $('#chat-person')
	$chatLeft = $('#chat-left')
	$name = $("#my-name")

	Status = require './maintain-chating.coffee'
	LiveUser = require './live-user.coffee'
	UserDom = require './user-dom.coffee'
	LiveChat = require './LiveChat-config.coffee'
	###
	* event handlers bind to chating userx
	###

	chatingUser =
		init: ->
			@clickToDeletePerson()
			@changeChatingPerson()
			@removeChatPerson()
			@getChatList()
		###
		* when login successful or refresh page, load the chat list and display on the page
		###
		getChatList: ->
			name = $name.text()
			self = @
			Status.getChatPersonsData name, (data)->
				isChating = data.isChating
				chatNow = data.chatNow
				if isChating.length
					$chatLeft.addClass('is-chating')
					LiveUser.addChatPerson(LiveChat)
					for user in isChating
						LiveUser.addChatPerson user
						LiveUser.userCollection[user.name] = new LiveUser.OneUser(user.name)
					if chatNow.length
						index = UserDom.getUserIndex(chatNow)
						UserDom.markChatingNowUser index
						self.nameChatingPerson(chatNow)
					console.log LiveUser.userCollection
		###
		* get the chating users number
		###
		checkChatingNum: ->
			return $chatingUser.find('img').length
		###
		* click to delete a chating user
		###
		clickToDeletePerson: (event)->
			self = @
			$chatingUser.delegate '.close-chating', 'click', ->
				name = $(@).parent().text()
				self.removeChatPerson(name)
				Status.removeUserFromChatList $name.text(), name, (data)->
					
				chatingNum = self.checkChatingNum()
				if chatingNum == 1
					self.nameChatingPerson('Live-Chat')
					$chatLeft.removeClass('is-chating')
				event.stopPropagation()

		###
		* click a user in chating users list to switch chating user
		###
		changeChatingPerson: ->
			self = @
			$chatingUser.delegate 'li', 'click', ->
				name = $(@).find('.chat-user-name').text()
				Status.updateChatingNowPerson $name.text(), name, (data)->
				self.nameChatingPerson(name)
				index = UserDom.getUserIndex(name)
				UserDom.markChatingNowUser index

				Status.getTwenty $name.text(), name, 0, 3, (data)->
					console.log  data
		###
		* remove a user in chating users list
		###
		removeChatPerson: (name)->
			allChatingUser = $chatingUser.find('li')
			for user in allChatingUser
				if $(user).text() == name
					$(user).remove()
		###
		* switch the chating user through keyboard
		###
		keybordchange: ->
		###
		* display the chating user
		###
		nameChatingPerson: (name)->
			$chatPerson.text(name)
	module.exports = 
		chatingUser: chatingUser