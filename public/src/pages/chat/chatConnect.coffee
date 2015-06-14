# 引入所需要的模块
chatHost = require './chatHost.coffee'
mockData = require './mockData.coffee'
chatBottom = require './chatBottom.coffee'
tpl = require './tpl.coffee'

# 缓存DOM节点变量
logStatus = $('#logStatus').val()
currentId = $('#current-userid').val()

# 与服务器的连接类
class ChatConnect
    # 构造函数
    constructor: ->
        port = chatHost.PORT
        url = chatHost.PROTOCOL + '://' + chatHost.HOST + ':' + port
        @socket = io();
        @socket.emit('login', {
            who: currentId
        })

chatConnect = null

console.log logStatus

if logStatus is '1'
    chatConnect = new ChatConnect()

# 返回实例，方便不同模块之间数据同步
module.exports = chatConnect
