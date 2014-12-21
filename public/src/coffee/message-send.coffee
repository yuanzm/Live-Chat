
class MessageSend
	constructor: ->
	init: ->

	###
	* keyboard events
	###
	keyDownEvent: ->
		_this = @
		$window.keydown (event)->
			if not (event.ctrlKey or event.metaKey or event.altKey)
				$chatInput.focus()

			if event.which is 13
				data =
					time: helper.getTime()
					userName: $name.text()
					message: $chatInput.val()
				$chatInput.val('')
				_this.sendMessage(data)
				$.ajax({
					type: "POST"
					url: '/addChat'
					data: data
					success: (data)->				
				})
	
