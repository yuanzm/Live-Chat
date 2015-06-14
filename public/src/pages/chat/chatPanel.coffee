# 引入页面所需模块
chatConnect = require './chatConnect.coffee'
tpl = require './tpl.coffee'
person = require './chatPerson.coffee'

currentId = $('#current-userid').val()
currentUsername = $('#current-username').val()
toId = $('#to-userid').val()
toUsername = $('#to-username').val()
toAvatar = $('.avatar img').attr('src')
logStatus = $('#logStatus').val()
# avatar = $('.avatar').attr('src')
currentUserAvatar = $('#current-user-avatar').val()
groupChatId = $('#group-chat-id').val()

# 聊天面板模块
chatPanel =
	# 绑定键盘事件
	keyDownSendMessage: (event)->
	    if event.keyCode is 13
	        $("#chat-submit").click()

	# 消息列表滚动到底部
	scrollBottom: ->
	    chatBox = $('.chat-log')
	    scrollTop = chatBox[0].scrollHeight;
	    chatBox.scrollTop(scrollTop);

	# 发送信息逻辑
	sendMessage: (event)->
		if logStatus is '0'
			alert '未登录不能聊天'
		else
			event.preventDefault()
			msg = $('#chat-input-box').val()
			type = ''

			if not msg
			    return
			console.log person.getChatId()
			if person.getChatId() is groupChatId
				type = 'group-chat'
			else
				type = 'chat'

			data =
				type: type
				who: currentId
				to: person.getChatId()
				msg: msg
				sender_name: currentUsername
				sender_avatar: currentUserAvatar
			
			chatConnect.socket.emit('chat', data)

			chatPanel.loadMessageToBox("right", msg, currentUsername, currentUserAvatar);
			chatPanel.scrollBottom()  # 滚轮事件

	###
	# 将消息加载到聊天窗口上面
	# @param {String} type: 一个用于指出是接收消息还是发送消息的字符串
	# @param {String} message: 字符串格式的消息主体
	###
	loadMessageToBox: (type, msg, name, avatar)->
	    message = tpl.oneMessageCompile({
	        className: type
	        name: name
	        content: msg
	        avatar: avatar
	    });
	    $('.chat-log').append(message)
	    $('#chat-input-box').val('')

	###
	# 加载历史聊天记录到聊天面板
	# @param {Array} msgs: 包含聊天信息的数组
	###
	loadChatLog: (msgs)->
      $('.chat-log').html('')

      for i in [0...msgs.length]
	        msg = msgs[i]
	        if msg.sender_id is currentId
	            chatPanel.loadMessageToBox('right', msg.content, currentUsername, currentUserAvatar)
	        else
	        	chatPanel.loadMessageToBox('left', msg.content, msg.sender_name, msg.sender_avatar)
      chatPanel.scrollBottom()  # 滚轮事件

module.exports = chatPanel
