if location.pathname == "/"
	$window = $(window)
	$liveUser = $('#live-user')
	$chatPerson = $('#chat-person')
	$chatLeft = $('#chat-left')
	$chatingUser = $('#chating-user')
	$myName = $('#my-name').text()
	$name = $("#my-name")
	$liveNumber = $('#live-number')

	Status = require './maintain-chating.coffee'
	UserDom = require './user-dom.coffee'
	LiveChat = require './LiveChat-config.coffee'
	# Collection = require('./chating-user.coffee').Collection
	###
	* event handlers bind to live users
	###
	liveUser=
		###
		* initialize instance
		###
		init: ->
			@bindEventHandler()
			self = @
			setTimeout self.showCollection, 2000, self
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
				chatUser = 
					name: $(@).find('span').text()
					gravatar: $(@).find('img').attr('src')
				selfName = self.getSelfName()
				isChating = self.detectIsChatting(chatUser.name)
				chatNum = self.checkChatingNum()
				if chatUser.name isnt selfName and isChating is false
					if not chatNum
						$chatLeft.addClass('is-chating')
						self.addChatPerson(LiveChat)
					# DOM level operation
					self.addChatPerson(chatUser)
					self.nameChatingPerson(chatUser.name)
					index = UserDom.getUserIndex(chatUser.name)
					UserDom.markChatingNowUser index
					# Database level operation
					Status.getEverChat selfName, chatUser.name, (data)->
						if data is false
							Status.insertChater selfName, chatUser.name, (data)->
					Status.addChatPerson selfName, chatUser, (data)-> 
					Status.updateChatingNowPerson selfName, chatUser.name, (data)->
		###
		* display the chat user in chating list
		* @param {Object} chatUser: the user data of chat user
		###
		addChatPerson: (chatUser)->
			chatDiv = '<li>'
			chatDiv += '<span class="chat-user-name">' + chatUser.name + '</span>'
			chatDiv += '<img class="gravatar" src="' + chatUser.gravatar + '">' 
			chatDiv += '<div class="close-chating">'
			chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>'
			chatDiv += '</div></li>'
			$chatingUser.find('ul').append($(chatDiv))
		
		# 判断是否有私聊
		detectIsChatting: (name)->
			isChating = false
			$allChatingUser = $chatingUser.find('span.chat-user-name')
			$allChatingUser.each ->
				if $(@).text() is name
					return isChating = true
			return isChating
		checkChatingNum: ->
			return $chatingUser.find('img').length

		###
		* display the chating user
		###
		nameChatingPerson: (name)->
			$chatPerson.text(name)

		###
		* show all the users live
		* @param {Object} allUser: an object contain all the live users data
		###
		freshUser: (allUser)->
			self = @
			$liveUser.empty()
			for user,userData of allUser
				self.showNewUser userData

		###
		* display all the users live
		* @param {Object} userData: user detail data
		###
		showNewUser: (userData)->
			aUser = '<li>'
			aUser += '<img class="gravatar" src="'
			aUser += userData.gravatar
			aUser += '">' 
			aUser += '<span>' + userData.name + '</span>'
			aUser += '</li>'

			$liveUser.append $(aUser)
		###
		* display live users number
		* @param {String} num: a string of live users number
		###
		showUserNumber: (num)->
			$liveNumber.text(num)

		OneUser: class OneUser
			constructor: (@name)->
				@chatStart = 0
				@chatLimit = 20
				@chatLStatus = 'live'
		userCollection: []
		showCollection: (self)->
			# console.log(self.userCollection)
	module.exports = liveUser