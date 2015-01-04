Connect = require "./connect-status.coffee"
liveUser = require "./live-user.coffee"
chatingUser = require("./chating-user.coffee").chatingUser
messageSend = require "./message-send.coffee"

connect = new Connect
connect.init()

liveUser.init()

chatingUser.init()

sender = new messageSend()
sender.init()

$('#chat-room').mCustomScrollbar({
	theme:"minimal-dark"
	scrollButtons:{
	 	enable:false,
	 	scrollType:"continuous",
	 	scrollSpeed:500,
	 	scrollAmount:40
	}
})
