if location.pathname == "/"
	$chatList = $('#chat-list')
	LiveUser = require './live-user.coffee'
	socket = io()
	$name = $("#my-name")

	class Notice
		constructor: (message)->
		displayNotice: ->

	MessageReceive =
		init: ->
			@detectPrivateMessage()
			@detectMessage()
		detectMessage: ->
			self = @
			socket.on 'message', (messageData)->
				self.showMessage messageData
		detectPrivateMessage: ->
			self = @
			socket.on 'private message', (data)->
				self.showMessage data
				# console.log LiveUser.userCollection
				LiveUser.userCollection[data.userName].noRead = 1
				
		#display  new message
		showMessage: (data) ->			
			aChat = '<li>'
			aChat += '<img class="gravatar" src="' + data.receiverData.gravatar + '">'
			aChat += '<span>' + data.userName + '</span>'
			# aChat += '<span>' + data.time + '</span>'
			aChat += '<br />'
			aChat += '<span>' + data.message + '</span>'
			aChat += '</li>'
			console.log 234234
			$chatList.append $(aChat)

	module.exports = MessageReceive