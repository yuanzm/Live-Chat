if location.pathname == "/"
	$window = $(window)
	$liveUser = $('#live-user')
	$chatPerson =$('#chat-person')
	$chatLeft = $('#chat-left')
	$chatingUser = $('#chating-user')
	$myName = $('#my-name').text()
	chatingUsers = 0;

	Changeuser=
		getSelfName: ->
			selfName = $myName;
		clickPerson: ->
			_this = @
			$liveUser.delegate 'span', 'click', ->
				name = @innerHTML
				selfName = _this.getSelfName()
				isChating = _this.detectIsChatting()
				if name != selfName
					_this.addChatPerson(name)
					++chatingUsers
					if not isChating
						$chatLeft.addClass('is-chating')

		addChatPerson: (name)->
			chatDiv = '<li>'
			chatDiv += '<span>' + name + '</span>'
			chatDiv += '<div class="close-chating">'
			chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>'
			chatDiv += '</li>'
			$chatingUser.find('ul').append($(chatDiv))

		removeChatPerson: (name)->
			allChatingUser = $chatingUser.find('li')
			for user in allChatingUser
				if $(user).text() == name
					alert(1231)

		clickToDeletePerson: ->
			_this = @
			$chatingUser.delegate '.close-chating', 'click', ->
				name = $(@).parent().text()
				--chatingUsers
				_this.removeChatPerson(name)
				if chatingUsers == 0
					$chatLeft.removeClass('is-chating')

		changeChatingPerson: ->

		detectIsChatting: ->
			isChating = if chatingUsers == 0 then false else true
		keybordchange: ->
		addNotice: ->

	module.exports = Changeuser