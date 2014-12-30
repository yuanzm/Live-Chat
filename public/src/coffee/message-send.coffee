if location.pathname == "/"
	Receiver = require "./message-receive.coffee"
	helper = require "./helper.coffee"
	Status = require "./maintain-chating.coffee"

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
			@successSendPrivateMessage()
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
					receiverData = 
						name: $chatPerson.text()
						gravatar: $gravatar.attr('src')
					data.receiverData = receiverData
					$chatInput.val('')
					self.sendMessage(data)

		###
		* send message
		* @param {Object} messageData: the detail of message,including receiver user data and message detail
		###
		sendMessage: (messageData)->
			isPrivate = Status.isPrivateChat()
			# console.log "isPrivate=" + isPrivate
			if isPrivate
				socket.emit 'private chat', messageData
			else
				socket.emit 'new message', messageData
				$.ajax({
					type: "POST"
					url: '/addChat'
					data: messageData
					success: (data)->				
				})
		successSendMessage: ->
			self = @
			socket.on 'send message',(messageData)->
				Receiver.showMessage messageData
		successSendPrivateMessage:->
			self = @
			socket.on 'send private message', (messageData)->
				Receiver.showMessage messageData
	module.exports = MessageSend