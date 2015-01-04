$chatingUser = $('#chating-user')
$chatList = $('#chat-list')
$gravatar = $('#gravatar')
$chatNow = $('#chat-person')

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
	#display  new message
	showMessage: (data) ->	
		aChat = '<li>'
		aChat += '<img class="gravatar" src="' + data.receiverData.gravatar + '">'
		aChat += '<span>' + data.userName + '</span>'
		# aChat += '<span>' + data.time + '</span>'
		aChat += '<br />'
		aChat += '<span>' + data.message + '</span>'
		aChat += '</li>'
		$chatList.prepend $(aChat)
	getSelfGravatar: ->
		return $gravatar.attr('src')
	getChattingNow: ->
		return $chatNow.text()

module.exports = UserDom