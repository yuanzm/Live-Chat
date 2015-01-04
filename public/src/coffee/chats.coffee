LiveUser = require './live-user.coffee'
Status = require './maintain-chating.coffee'
UserDom = require './user-dom.coffee'
LiveChat = require './LiveChat-config.coffee'

$chattingUser = $('#chating-user')
$gravatar = $('#gravatar')
$name = $("#my-name")
$chatsList = $('#chat-list')
$loadMore = $('.load-more')

###
* When load chats from database,we need to package it to insert into the front-end templates
* @param {Array} messageData: an array of chats
* @param {gravatar} gravatar: 
###
processData = (messageData)->
	myGravatar = UserDom.getSelfGravatar()
	gravatar = UserDom.getChattingGravatar()
	allmessage = []
	for chat in messageData
		gravatar = if chat.speaker is $name.text() then myGravatar else gravatar 
		chatPackage =
			receiverData: {gravatar: gravatar}
			userName: chat.speaker
			message: chat.message
		allmessage.push chatPackage
	return allmessage

###
* Before loading more chats, we need to know the status of chats in chat room
* @param {String} name: the name of user
###
getChatStatus = (name)->
	console.log name
	chatName = LiveUser.userCollection[name] 
	return status =
		start:  chatName.getChatStart()
		limit: chatName.getChatLimit()

updateChatStatus = (name, chatLength)->
	$isChatting = $chattingUser.find('.chat-user-name')
	$isChatting.each ->
		thisname  = $(@).text()
		if thisname isnt name
			LiveUser.userCollection[thisname].setChatStart(0)
	chatName = LiveUser.userCollection[name] 
	oldStart = chatName.getChatStart()
	chatName.setChatStart(oldStart + chatLength)

###
* Repaint the chat room
* @param {Array} allmessage: an array contain messages need to be repainted.
###
repaintChatRoom = (allMessage, needEmpty)->
	$('.load-more').remove()
	if needEmpty
		$chatsList.empty()
	for message in allMessage
		UserDom.showMessage message
	$chatsList.prepend($('<a class="load-more">Load more</a>'))

loadChats =
	###
	* Load history chats from database.
	###
	loadPrivateChat: (name, needEmpty)->
		status = getChatStatus name
		start = status.start
		limit = status.limit
		self = @
		Status.getTwenty $name.text(), name, start, (start + limit), (data)->
			if data
				allmessage = processData(data)
				repaintChatRoom allmessage, needEmpty								
				chatLength = allmessage.length
				updateChatStatus name, chatLength
	
	loadGroupChat: (needEmpty)->
		self = @
		status = getChatStatus(LiveChat.name)
		start = status.start
		Status.getGroupTwenty start, (data)->
			if data
				repaintChatRoom data, needEmpty
				updateChatStatus LiveChat.name, data.length

	loadMore: ->
		self = @
		$chatsList.delegate '.load-more', 'click', ->
			chatNow = UserDom.getChattingNow()
			if chatNow is LiveChat.name
				self.loadGroupChat false
			else
				gravatar = UserDom.getChattingGravatar chatNow
				self.loadPrivateChat(chatNow,false)
			return false

module.exports = loadChats