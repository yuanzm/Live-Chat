if location.pathname == "/"
	$chatingUser = $('#chating-user')
	$chatPerson = $('#chat-person')

	###
	* event handlers bind to chating userx
	###
	chatingUser =
		init: ->
			@clickToDeletePerson()
			@changeChatingPerson()
		# 点击来删除聊天对象
		clickToDeletePerson: ->
			self = @
			$chatingUser.delegate '.close-chating', 'click', ->
				name = $(@).parent().text()
				--chatingUsers
				self.removeChatPerson(name)
				if chatingUsers == 0
					self.nameChatingPerson('Live-Chat')
					$chatLeft.removeClass('is-chating')
		# 点击正在聊天对象的某一个对象产生切换动作
		changeChatingPerson: ->
			self = @
			$chatingUser.delegate 'li', 'click', ->
				name = $(@).find('.chat-user-name').text()
				self.nameChatingPerson(name)
		# 删除正在聊天的对象
		removeChatPerson: (name)->
			allChatingUser = $chatingUser.find('li')
			for user in allChatingUser
				if $(user).text() == name
					$(user).remove()

		# 通过键盘事件来进行切换聊天对象
		keybordchange: ->
		# 新消息通知
		addNotice: ->
		###
		* display the chating user
		###
		nameChatingPerson: (name)->
			$chatPerson.text(name)
	module.exports = chatingUser