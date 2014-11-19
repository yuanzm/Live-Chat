chat = require "./chat.coffee"
chatCLient = require "./chat-client.coffee"

socket = io()


name = $("#my-name").text()
socket.emit "join"

userList = $('.user-list')

# socket.emit "new message","yuanzm"
socket.on 'new user', (data)->
	userList.empty().append('<span>' + data.userNumbers + '</span>')

socket.on 'user left', (data)->
	userList.empty().append('<span>' + data.userNumbers + '</span>')

socket.on 'login', (data)->
	userList.empty().append('<span>' + data.userNumbers + '</span>')
	
	
	
