###
# chat.coffee
# Author: yuanzm
#
# 聊天模块
#   1. 在任何页面加载的时候，先判断用户是否登录，如果登录，与聊天服务器建立连接，如果没有登录，不建立连接
#   2. 在任何页面，与聊天服务器建立连接之后，获取历史聊天用户列表，并且加载到页面
#   3. 在任何页面，加载好了用户历史聊天用户列表之后，判断是否有未读消息，如果有，显示底部的私聊栏
#   4. 在任何页面，加载好了用户历史聊天用户列表之后，最后一个聊天用户为当前聊天用户
#   5. 在任何页面，点击下面的私聊栏，清零未读数目，弹出聊天面板，点击聊天面板的叉叉，关闭聊天面板，重新显示私聊栏
#   6. 在用户资料页面，点击`谈一谈`按钮，首先判断该用户是否在历史聊天用户中，如果不在添加到历史聊天对象，如果在，把该用户设置成正在聊天对象
#   7. 在任何面，收到了新消息，首先判断聊天面板是否打开
        a. 如果打开，先判断收到的消息是否为当前聊天对象，如果是，直接显示消息，如果不是，判断是否在聊天列表，如果在，加上小红点，如果不在，添加到聊天对象，并加上小红点
        b. 如果没有打开，执行上述操作的同时，私聊栏显示未读数目
###

# 引入页面所需模块
chattingList = require './chattingList.coffee'
chatPanel = require './chatPanel.coffee'
chatMain = require './chatMain.coffee'
chatBottom = require './chatBottom.coffee'
chatConnect = require './chatConnect.coffee'
messageRouter = require './messageRouter.coffee'

# 聊天窗口打开状态
openState = false

# 脚本加载完成得时候执行事件绑定操作
$ ->
    # $('#talk-btn').bind 'click', chatMain.talkHandler
    $("body").delegate '#chat-box', 'keydown', chatPanel.keyDownSendMessage
    $("body").delegate '#chat-submit', 'click', chatPanel.sendMessage
    $("body").delegate '.chat-close-btn', 'click', chatBottom.closeChatBottom
    $('.chat-bottpm-bar').bind 'click', chatBottom.clickBottomHandler
    $('body').delegate '.chat-contact', 'click', chattingList.toggleChattingUser
    
    # 因为模块引用顺序的问题，需要在这里绑定监听事件
    if chatConnect
        chatConnect.socket.on 'message', (message) ->
            socket = chatConnect.socket
            messageRouter message, socket
