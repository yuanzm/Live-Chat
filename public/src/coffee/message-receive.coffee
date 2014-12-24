if location.pathname == "/"
	$chatList = $('#chat-list')
	socket = io()
	MessageReceive =
		init: ->
			@detectPrivateMessage()
			@detectMessage()
		detectMessage: ->
			_this = @
			socket.on 'message', (messageData)->
				_this.showMessage messageData
		detectPrivateMessage: ->
			_this = @
			socket.on 'private message', (data)-> 
				console.log data.userName + '对你说' + data.message
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

	module.exports = MessageReceive