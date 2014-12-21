if location.pathname == "/"
	helper = require './helper.coffee'
	liveUser = require './live-user.coffee'

	# Initialize varibles
	$gravatar = $('#gravatar')
	socket = io()
	###
	* A class to track the connection status
	###
	class Connect
		constructor: ->
		init: ->
			self = @

			self.loginMessage()
			self.detectNewUser()
			self.successionLoginMessage()
			self.detectUserLeft()
		###
		* if user refresh page or login,send message to server
		###
		loginMessage: ->
			socket.emit 'join', $gravatar.attr('src')
		###
		* if user login success or refresh page,refresh live users list and live users number
		###
		successionLoginMessage: ->
			self = @
			socket.on 'success login', (data)->
				allUser = data.allUser
				liveUser.freshUser allUser
				liveUser.showUserNumber data.userNumbers
		###
		* detect whether a new user is join to chat room
		###
		detectNewUser: ->
			self = @
			socket.on 'new user', (data)->
				allUser = data.allUser
				liveUser.freshUser allUser
				liveUser.showUserNumber data.userNumbers
		# when an user leave chat room,delete the user in the page
		detectUserLeft: ->
			self = @
			socket.on 'user left', (data)-> 
				allUser = data.allUser
				liveUser.freshUser allUser
				liveUser.showUserNumber data.userNumbers

	module.exports = Connect