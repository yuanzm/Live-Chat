$chatingUser = $('#chating-user')

UserDom =
	markChatingNowUser: (index)->
		$chatingUser.find('img').removeClass 'chat-now'
		$chatingUser.find('img').eq(index).addClass 'chat-now'

	getUserIndex: (name)->
		currentIndex = 0
		$chatingUser.find('span.chat-user-name').each (index)->
			userName = $(@).text()
			if userName is name
				currentIndex = index
				return
		return currentIndex

module.exports = UserDom