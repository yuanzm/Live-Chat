# 正在聊天的用户模块

# 引入所需模块
mockData = require './mockData.coffee'
tpl = require './tpl.coffee'
person = require './chatPerson.coffee'
chatConnect = require './chatConnect.coffee'

# 缓存DOM节点变量
$allChattingUser = $('.all-chatting-user')
currentId = $('#current-userid').val()
$chatBottomBar = $('.chat-bottpm-bar')
chatBottom = require './chatBottom.coffee'
groupChatId = $('#group-chat-id').val()

chattingList =
	# 判断一个用户是否在列表中
	getIndexInTheChatList: (id)->
	    flag = false

	    $('.chat-contact').each (index, item)->
          id = id
          userIndex = $(item).find('.user-name').data('userid')
          if userIndex is id
              flag = index

	    return flag

	# 获取当前正在聊天对象
	getCurrentChatIndex: ->
	    currentIndex = 0

	    $('.chat-contact').each (index, item)->
	        if $(item).hasClass('active')
	            currentIndex = index

	    return currentIndex

	# 给一个聊天对象加上小圆点
	addNewMessageToUser: (index) ->
	    $contact = $('.chat-contact').eq(index)
	    currentNumber = Math.floor($contact.find('.unread-number').text())
	    newNumber = if currentNumber + 1 > 99 then 99 else currentNumber + 1
	    $contact.find('.unread-number').removeClass('hidden').text newNumber

	# 标记一个用户的所有信息为已读
	markAsReadedForOneUser: (index)->
	    $contact = $('.chat-contact').eq(index)
	    $contact.find('.unread-number').text('0').addClass('hidden')

	# 标记一个用户为当前聊天对象
	markUserAsActicve: (index)->
	    $('.chat-contact').eq(index).addClass('active').siblings('.chat-contact').removeClass('active')

	# 获取一个聊天对象的未读消息数量
	getUnreadMessageNumber: (index)->
		$contact = $('.chat-contact').eq(index)
		currentNumber = Math.floor($contact.find('.unread-number').text())

		return currentNumber
	# 获取一个用户的在线状态
	getUserOnlineState: (index)->
		$contact = $('.chat-contact').eq(index)
		online = if $contact.find('.status').hasClass('on') then true else false

		return online

	# 改变一个用户的在线状态
	changeUserOnlineState: (index, value)->
		$contact = $('.chat-contact').eq(index)
		$contact.find('.status').removeClass('on').removeClass('off').addClass(value)

	

	# 将一个用户添加到聊天列表
	# @param {Boolean} isClick: 一个用于指出是不是点击`谈一谈`按钮来添加对象的布尔值
	addUserToChatList: (toUsername, toId, toAvatar, status, isClick)->


		# 用于判断用户是否已经在聊天列表里面
	    flag = chattingList.getIndexInTheChatList(toId)
	    # 用户一开始不在列表里面
	    if flag is false
	        contact =
	            avatar: toAvatar
	            id: toId
	            username: toUsername
	            new_msg_count: 0
	            className: 'hidden'
	            status: status

	        str = $(tpl.oneChatterCompile contact)
	        $allChattingUser.append str
	        # 该对象通过点击`谈一谈`按钮添加，设置改对象为当前聊天对象
	        if isClick
	        	chattingList.markUserAsActicve(chattingList.getIndexInTheChatList(toId))
	    # 该对象一开始在列表里面
	    else
	    	# 该对象通过点击`谈一谈`按钮添加，设置改对象为当前聊天对象，同时标记该对象的所有消息为已读，主要针对该对象在离线列表里面的情况
	    	if isClick
	        	chattingList.markUserAsActicve(flag)
	        	chattingList.markAsReadedForOneUser(flag)

	# 点击聊天对象里面的用户事件处理逻辑
	toggleChattingUser: ->
		# 获取正在聊天对象和所点击对象的id
		currentPerson = person.getChatId()
		toId = $(this).find('.user-name').data('userid') + ''

		liIndex = chattingList.getIndexInTheChatList(toId)
		$(this).addClass('active').siblings('.chat-contact').removeClass('active')

		# 如果点击的对象不是当前聊天对象，删除掉当前窗口的所有消息
		# if currentPerson isnt toId
		$('.chat-log').empty()
	  	
		# 设置当前聊天对象为所点击的对象
		person.setChatId(toId)

		# 实时显示未读消息栏的数量
		temp = chattingList.getUnreadMessageNumber(liIndex)
		chatBottom.removeNumber(temp)

		# 标记该用户的所有消息为已读
		chattingList.markAsReadedForOneUser(liIndex)

		# 加载消息到聊天框, 清空数据库未读消息

		data =
		    who: currentId
		    to: toId

		if toId is groupChatId
			chatConnect.socket.emit('clear_group_msg', data);
		else
			chatConnect.socket.emit('load_clear_unread_chat_msg', data);

		return false
module.exports = chattingList
