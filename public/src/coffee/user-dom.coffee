$chatingUser = $('#chating-user')
$chatList = $('#chat-list')
$gravatar = $('#gravatar')
$chatNow = $('#chat-person')
$chatRoom = $('#chat-room')

UserDom =
	markChatingNowUser: (index)->
		$chatingUser.find('img').removeClass 'chat-now'
		$chatingUser.find('img').eq(index).addClass 'chat-now'

	getChattingGravatar: ->
		name = $chatNow.text()
		index = @getUserIndex name
		$chatingUser.find('img').eq(index).attr('src')

	getUserIndex: (name)->
		currentIndex = 0
		$chatingUser.find('span.chat-user-name').each (index)->
			userName = $(@).text()
			if userName is name
				currentIndex = index
				return
		return currentIndex

	removeNotice: (displayArea, name)->
		index = UserDom.getUserIndex name
		displayArea.find('li').eq(index).find('.notice').remove()
	#display  new message
	showMessage: (data, isprepend) ->	
		aChat = '<li>'
		aChat += '<img class="gravatar" src="' + data.receiverData.gravatar + '">'
		aChat += '<span>' + data.userName + '</span>'
		# aChat += '<span>' + data.time + '</span>'
		aChat += '<br />'
		aChat += '<span>' + data.message + '</span>'
		aChat += '</li>'
		if isprepend
			$chatList.prepend $(aChat)
		else
			$chatList.append $(aChat)
	getSelfGravatar: ->
		return $gravatar.attr('src')
	getChattingNow: ->
		return $chatNow.text()
	scrollToBottom: ->
		$chatRoom.scrollTop($chatRoom[0].scrollHeight)
	emptyChatRoom: ->
		$chatList.empty()
module.exports = UserDom