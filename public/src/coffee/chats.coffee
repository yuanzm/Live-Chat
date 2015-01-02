LiveUser = require './live-user.coffee'
Status = require './maintain-chating.coffee'
UserDom = require './user-dom.coffee'
LiveChat = require './LiveChat-config.coffee'

$chattingUser = $('#chating-user')
$gravatar = $('#gravatar')
$name = $("#my-name")
$chatsList = $('#chat-list')

###
* When load chats from database,we need to package it to insert into the front-end templates
* @param {Array} messageData: an array of chats
* @param {gravatar} gravatar: 
###
processData = (messageData, gravatar)->
	myGravatar = UserDom.getSelfGravatar()
	allmessage = []
	for chat in messageData
		gravatar = if chat.speaker is $name.text() then myGravatar else gravatar 
		chatPackage =
			receiverData: {gravatar: gravatar}
			userName: chat.speaker
			message: chat.message
		allmessage.push chatPackage
	return allmessage

updateChatStatus = (name, chatLength)->
	$isChatting = $chattingUser.find('.chat-user-name')
	$isChatting.each ->
		LiveUser.userCollection[$(@).text()].setChatStart(0)
	chatName = LiveUser.userCollection[name] 
	oldStart = chatName.getChatStart()
	chatName.setChatStart(oldStart + chatLength)

###
* Repaint the chat room
* @param {Array} allmessage: an array contain messages need to be repainted.
###
repaintChatRoom = (allMessage)->
	$chatsList.empty()
	for message in allMessage
		UserDom.showMessage message

loadChats =
	###
	* Load history chats from database.
	###
	loadPrivateChat: (name, gravatar, start, limit)->
		self = @
		Status.getTwenty $name.text(), name, start, (start + limit), (data)->
			if data
				allmessage = processData(data, gravatar)
				repaintChatRoom allmessage								
				chatLength = allmessage.length
				updateChatStatus name, chatLength
				# console.log LiveUser.userCollection[name].getChatStart()
	
	loadGroupChat: (start, limit)->
		self = @
		Status.getGroupTwenty start, (data)->
			if data
				repaintChatRoom data
				updateChatStatus LiveChat.name, data.length

module.exports = loadChats