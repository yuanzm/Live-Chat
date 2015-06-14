# 引入页面所需模块
chattingList = require './chattingList.coffee'
liveList = require './liveList.coffee'
chatPanel = require './chatPanel.coffee'
tpl = require './tpl.coffee'
chatBottom = require './chatBottom.coffee'
mockData = require './mockData.coffee'
person = require './chatPerson.coffee'

# 缓存DOM节点
currentId = $('#current-userid').val()
$chatBottomBar = $('.chat-bottpm-bar')
toUsername = $('#to-username').val()
toAvatar = $('.avatar img').attr('src')
$currentPage = $('#currentPage')
groupChatId = $('#group-chat-id').val()

# 接收到服务器的消息之后采取的相应动作
messageRouter = (data, socket)->
    if data.dowhat is 'login'
        console.log 'user_id: ' + data.who + ': ' + data.dowhat
        isInLiveChat = liveList.getIndexInTheChatList(data.user._id)
        console.log isInLiveChat
        if isInLiveChat is false
            liveList.addUserToLiveList(data.user._id, data.user.loginname)
            
        # 判断下线的用户是否在正在聊天列表里面
        flag = chattingList.getIndexInTheChatList(data.who)
        if flag isnt false
            chattingList.changeUserOnlineState(flag, 'on')
            
    # 用户与服务器成功建立连接
    if data.dowhat is 'join'
        console.log 'user_id: ' + data.who + ' send get_chat_list'
        data =
            who: currentId

        socket.emit('get_chat_list', data);
        socket.emit('get_live_list');

    if data.dowhat is 'chat'
        console.log data
        # 聊天面板已经打开
        sender = data.who
        index = chattingList.getIndexInTheChatList(sender)
        currentIndex = chattingList.getCurrentChatIndex()
        # console.log index, currentIndex
        if index != false
            if index is currentIndex
                console.log '消息的发送方就是当前聊天对象'
                # 消息的发送方就是当前聊天对象
                chatPanel.loadMessageToBox('left', data.msg.content, data.msg.username, data.msg.avatar)
            else
                console.log '消息的发送方不是当前聊天对象，但是在聊天列表里面'
                # 消息的发送方不是当前聊天对象，但是在聊天列表里面
                chattingList.addNewMessageToUser(index)
                chatBottom.addOneUnread()
        else
            # 消息的发送方不在聊天对象里面
            #   1. 首先添加到聊天列表里面
            #   2. 添加小圆点
            console.log '消息的发送方不在聊天对象里面'
            chattingList.addUserToChatList(data.msg.username, sender, data.msg.avatar, false)
            newIndex = chattingList.getIndexInTheChatList(data.who)
            chattingList.addNewMessageToUser(newIndex)

            chatBottom.addOneUnread()

        # 聊天面板没有打开
        if not $currentPage
            console.log '有新消息来了'
            chatBottom.loadChatBottomBar()
            if index != false
                if index is currentIndex
                    chatBottom.addOneUnread()

        chatPanel.scrollBottom()  # 滚轮事件

    if data.dowhat is 'logout'
        console.log 'user_id: ' + data.who + ': ' + data.dowhat
        # 判断下线的用户是否在离线列表里面
        flag = chattingList.getIndexInTheChatList(data.who)
        if flag isnt false
            chattingList.changeUserOnlineState(flag, 'off')

        liveList.removeOneUser(data.who);

    if data.dowhat == 'get_live_list'
        liveUserArray = data.liveUserArray;
        for user in liveUserArray 
            liveList.addUserToLiveList(user.id, user.name);

    if data.dowhat is 'get_chat_list'
        console.log(data);
        total_new_msg_count = data.total_new_msg_count
        contacts = data.contacts
        # 如果有未读新消息，显示底部未读栏
        if total_new_msg_count > 0
            chatBottom.setUnread(total_new_msg_count)
            chatBottom.loadChatBottomBar()

        if contacts.length
            # 将所有聊天对象添加到列表，初始的时候，所有人的消息都未读，点击底部栏，会读取最后一个对象的消息
            for contact in contacts
                contact.className = ''

                chattingList.addUserToChatList(contact.username, contact.id, contact.avatar, contact.online, false)
                # 给该对象添加未读消息
                for i in [0...parseInt(contact.new_msg_count)]
                    chattingList.addNewMessageToUser(chattingList.getIndexInTheChatList(contact.id))

        #     # 设置当前聊天对象为聊天列表的最后一个对象
        #     person.setChatId(contacts[contacts.length - 1].id)
        # else
        # 默认设置群聊为当前聊天对象
        person.setChatId(groupChatId)
        socket.emit('clear_group_msg')


    if data.dowhat is 'chat_log'  # 聊天记录
        console.log data
        messages = data.messages;

        index = chattingList.getIndexInTheChatList(data.id)
        status = if data.online is true then 'on' else 'off'
        chattingList.changeUserOnlineState(index, status)

        # 加载历史聊天记录
        chatPanel.loadChatLog(messages)

module.exports = messageRouter
