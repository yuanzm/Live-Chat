if location.pathname == "/"
	$chatList = $('#chat-list')
	socket = io()
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
				# alert(data)
				# console.log data
				self.showMessage data
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