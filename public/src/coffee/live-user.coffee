if location.pathname == "/"

	$window = $(window)
	$liveUser = $('#live-user')
	$chatPerson = $('#chat-person')
	$chatLeft = $('#chat-left')
	$chatingUser = $('#chating-user')
	$myName = $('#my-name').text()
	chatingUsers = 0;
	$name = $("#my-name")

	###
	* event handlers bind to live users
	###
	liveUser=
		###
		* initialize instance
		###
		init: ->
			@bindEventHandler()
		###
		* initialize all the event handlers
		###
		bindEventHandler: ->
			@clickPerson()
		###
		* get self name through nickname
		###
		getSelfName: ->
			selfName = $myName;
		###
		* bind event handler to live user
		* if the user clicked is self,nothing happen
		* if the user clicked is already in chating list,nothing happen
		* if the user clicked is not self and not in chating list,add it to the chating list
		* if the user added to the chating list is the first one,show the chating list
		###
		clickPerson: ->
			self = @
			$liveUser.delegate 'li', 'click', ->
				name = $(@).find('span').text()
				gravatar = $(@).find('img').attr('src')
				selfName = self.getSelfName()
				isChating = self.detectIsChatting(gravatar)
				chatNum = self.checkChatingNum()
				if name isnt selfName and isChating is false 
					chatUser = 
						name: name
						gravatar: gravatar
					self.addChatPerson(chatUser)
					self.nameChatingPerson(name)
					++chatingUsers
					if not chatNum
						$chatLeft.addClass('is-chating')

		###
		* display the chat user in chating list
		* @param {Object} chatUser: the user data of chat user
		###
		addChatPerson: (chatUser)->
			chatDiv = '<li>'
			chatDiv += '<span></span>'
			chatDiv += '<img class="gravatar" src="' + chatUser.gravatar + '">' 
			chatDiv += '<div class="close-chating">'
			chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>'
			chatDiv += '</div></li>'
			$chatingUser.find('ul').append($(chatDiv))
		
		# 判断是否有私聊
		detectIsChatting: (gravatar)->
			isChating = false
			$allChatingUser = $chatingUser.find('img')
			$allChatingUser.each ->
				if $(@).attr('src') is gravatar
					return isChating = true
			return isChating
		checkChatingNum: ->
			return $chatingUser.find('img').length
		nameChatingPerson: (name)->
			$chatPerson.text(name)

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

	module.exports = liveUser