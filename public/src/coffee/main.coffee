anotherModule = require "./another-module.coffee"

socket = io()

socket.emit "join","yuanzm"

# socket.emit "new message","yuanzm"
socket.on 'new user', (data)->
	userList = $('.user-list')
	userList.empty().append('<span>' + data.userNumbers + '</span>')