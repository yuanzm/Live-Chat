$chatingUser = $('#chating-user')
$chatList = $('#chat-list')
$gravatar = $('#gravatar')

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
	#display  new message
	showMessage: (data) ->	
		aChat = '<li>'
		aChat += '<img class="gravatar" src="' + data.receiverData.gravatar + '">'
		aChat += '<span>' + data.userName + '</span>'
		# aChat += '<span>' + data.time + '</span>'
		aChat += '<br />'
		aChat += '<span>' + data.message + '</span>'
		aChat += '</li>'
		$chatList.append $(aChat)
	getSelfGravatar: ->
		return $gravatar.attr('src')


module.exports = UserDom