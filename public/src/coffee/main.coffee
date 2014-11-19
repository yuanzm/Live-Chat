anotherModule = require "./another-module.coffee"

socket = io()

socket.emit "new message","yuanzm"
