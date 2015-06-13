# 缓存DOM节点
currentId = $('#current-userid').val()
toId = $('#to-userid').val()
toUsername = $('#to-username').val()
toAvatar = $('.avatar img').attr('src')
logStatus = $('#logStatus').val()

# 引入页面所需模块
chattingList = require './chattingList.coffee'
chatConnect = require './chatConnect.coffee'

chatMain =
    # 点击`谈一谈`按钮事件处理逻辑
    talkHandler: ->
        if logStatus is '0'
            alert "请先登录"
            return

        if currentId is toId
            alert '不能和自己聊天'
            return

        $('#chat-box').show()
        window.openState = true

        if currentId and toId
            # 添加获取聊天记录
            chattingList.addUserToChatList(toUsername, toId, toAvatar, 'on', true)
            data =
                who: currentId
                dowhat: 'chat_log'
                to: toId

            chatConnect.ws.send(JSON.stringify(data))

module.exports = chatMain
