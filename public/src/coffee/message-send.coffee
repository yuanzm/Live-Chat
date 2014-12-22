if location.pathname == "/"
	Receiver = require "./message-receive.coffee"
	helper = require "./helper.coffee"
	$window = $(window)
	$chatInput = $('#chat-input')
	$name = $('#my-name')
	$chatPerson = $('#chat-person')
	$gravatar = $('#gravatar')
	socket = io()

	Receiver.init()
	class MessageSend
		constructor: ->
		init: ->
			@keyDownEvent()
			@successSendMessage()
		###
		* keyboard events
		###
		keyDownEvent: ->
			self = @
			$window.keydown (event)->
				if not (event.ctrlKey or event.metaKey or event.altKey)
					$chatInput.focus()

				if event.which is 13
					###
					* detail of message,including the sender's name and message content
					###
					data =
						time: helper.getTime()
						userName: $name.text()
						message: $chatInput.val()
					$chatInput.val('')
					self.sendMessage(data)
					$.ajax({
						type: "POST"
						url: '/addChat'
						data: data
						success: (data)->				
					})

		###
		* send message
		* @param {Object} messageData: the detail of message,including receiver user data and message detail
		###
		sendMessage: (messageData)->
			receiverData = 
				name: $chatPerson.text()
				# gravatar: $gravatar.attr('src')
			messageData.receiverData = receiverData
			if $chatPerson.text() is 'Live-Chat'
				socket.emit 'new message', messageData
			else
				socket.emit 'private chat', messageData

		successSendMessage: ->
			self = @
			socket.on 'send message',(messageData)->
				Receiver.showMessage messageData

	module.exports = MessageSend