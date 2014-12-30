###
* A module to process the offline user list
###
$chatList = $('#chating-user')
$liveUser = $('#live-user')

offLine =
	offLineList: []
	markOffLineUsers: ->
		$chatLists = $chatList.find('span')
		$liveUsers = $liveUser.find('span')
		chatArray = []
		liveArray = []

		$chatLists.each ->
			if ($(@).text() isnt '') and ($(@).text() isnt 'Live-Chat') 
				chatArray.push $(@).text()
		$liveUsers.each ->
			liveArray.push $(@).text()
		for chat in chatArray
			if @offLineList[chat]
				@opaqueUser chat
				delete @offLineList[chat]
			if not (chat in liveArray)
				@offLineList[chat] = chat
				@translucentUser chat

	translucentUser: (name)->
		$chatLists = $chatList.find('li')
		$chatLists.each ->
			if $(@).find('.chat-user-name').text() is name
				$(@).css('opacity', '0.5')
	opaqueUser: (name)->
		$chatLists = $chatList.find('li')
		$chatLists.each ->
			if $(@).find('.chat-user-name').text() is name
				$(@).css('opacity', '1')

module.exports = offLine
