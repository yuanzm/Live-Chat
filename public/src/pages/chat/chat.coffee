# 引入页面所需模块
chattingList = require './chattingList.coffee'
chatPanel = require './chatPanel.coffee'
chatBottom = require './chatBottom.coffee'
chatConnect = require './chatConnect.coffee'
messageRouter = require './messageRouter.coffee'
liveList = require './liveList.coffee'

# 脚本加载完成得时候执行事件绑定操作
$ ->
    $("body").delegate '.live-contact', 'click', liveList.liveUserClickHandler
    $("body").delegate '#chat-box', 'keydown', chatPanel.keyDownSendMessage
    $("body").delegate '#chat-submit', 'click', chatPanel.sendMessage
    $("body").delegate '.chat-close-btn', 'click', chatBottom.closeChatBottom
    $('.chat-bottpm-bar').bind 'click', chatBottom.clickBottomHandler
    $('body').delegate '.chat-contact', 'click', chattingList.toggleChattingUser

    # $('.chat-log').tinyscrollbar();
    
    # 因为模块引用顺序的问题，需要在这里绑定监听事件
    if chatConnect
        chatConnect.socket.on 'message', (message) ->
            socket = chatConnect.socket
            messageRouter message, socket
