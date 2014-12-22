if location.pathname == "/"
	$chatingUser = $('#chating-user')
	$chatPerson = $('#chat-person')
	$chatLeft = $('#chat-left')

	###
	* event handlers bind to chating userx
	###
	chatingUser =
		init: ->
			@clickToDeletePerson()
			@changeChatingPerson()
			@removeChatPerson()
		###
		* get the chating users number
		###
		checkChatingNum: ->
			return $chatingUser.find('img').length
		###
		* click to delete a chating user
		###
		clickToDeletePerson: ->
			self = @
			$chatingUser.delegate '.close-chating', 'click', ->
				name = $(@).parent().text()
				self.removeChatPerson(name)
				chatingNum = self.checkChatingNum()
				if chatingNum == 0
					self.nameChatingPerson('Live-Chat')
					$chatLeft.removeClass('is-chating')
		###
		* click a user in chating users list to switch chating user
		###
		changeChatingPerson: ->
			self = @
			$chatingUser.delegate 'li', 'click', ->
				name = $(@).find('.chat-user-name').text()
				self.nameChatingPerson(name)
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
	module.exports = chatingUser