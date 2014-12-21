if location.pathname == "/"
	helper = require './helper.coffee'

	# Initialize varibles
	$gravatar = $('#gravatar')
	socket = io()
	###
	* A class to track the connection status
	###
	class Connect
		constructor: ->
		init: ->
			_this = @

			_this.loginMessage()
			_this.detectNewUser()
			_this.successionLoginMessage()
			_this.detectUserLeft()
		###
		* if user refresh page or login,send message to server
		###
		loginMessage: ->
			socket.emit 'join', $gravatar.attr('src')
		###
		* if user login success or refresh page,refresh live users list and live users number
		###
		successionLoginMessage: ->
			_this = @
			socket.on 'success login', (data)->
				allUser = data.allUser
				# _this.freshUser allUser
				# _this.showUserNumber data.userNumbers

		detectNewUser: ->
			_this = @
			socket.on 'new user', (data)->
				allUser = data.allUser
				# _this.freshUser allUser
				# _this.showUserNumber data.userNumbers
		# when an user leave chat room,delete the user in the page
		detectUserLeft: ->
			_this = @
			socket.on 'user left', (data)-> 
				allUser = data.allUser
				# _this.freshUser allUser
				# _this.showUserNumber data.userNumbers

	module.exports = Connect