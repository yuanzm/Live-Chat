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