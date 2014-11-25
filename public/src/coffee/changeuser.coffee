if location.pathname == "/"
	$window = $(window)
	$liveUser = $('#live-user')
	$chatPerson =$('#chat-person')
	$chatLeft = $('#chat-left')
	$chatingUser = $('#chating-user')
	$myName = $('#my-name').text()
	chatingUsers = 0;

	Changeuser=
		# 获取自己的用户名
		getSelfName: ->
			selfName = $myName;
		# 点击在线用户列表的行为
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
		# 添加聊天对象
		addChatPerson: (name)->
			chatDiv = '<li>'
			chatDiv += '<span>' + name + '</span>'
			chatDiv += '<div class="close-chating">'
			chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>'
			chatDiv += '</li>'
			$chatingUser.find('ul').append($(chatDiv))

		# 删除正在聊天的对象
		removeChatPerson: (name)->
			allChatingUser = $chatingUser.find('li')
			for user in allChatingUser
				if $(user).text() == name
					$(user).remove()
		# 点击来删除聊天对象
		clickToDeletePerson: ->
			_this = @
			$chatingUser.delegate '.close-chating', 'click', ->
				name = $(@).parent().text()
				--chatingUsers
				_this.removeChatPerson(name)
				if chatingUsers == 0
					_this.nameChatingPerson('Live-Chat')
					$chatLeft.removeClass('is-chating')
		# 点击正在聊天对象的某一个对象产生切换动作
		changeChatingPerson: ->
			_this = @
			$chatingUser.delegate 'span', 'click', ->
				name = $(@).text()
				_this.nameChatingPerson(name)
		# 判断是否有私聊
		detectIsChatting: ->
			isChating = if chatingUsers == 0 then false else true

		# 通过键盘事件来进行切换聊天对象
		keybordchange: ->
		# 新消息通知
		addNotice: ->
		nameChatingPerson: (name)->
			console.log name
			$chatPerson.text(name)

	module.exports = Changeuser