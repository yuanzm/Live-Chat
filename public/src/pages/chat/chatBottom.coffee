# 底部的动态消息组件

# 缓存DOM节点
$chatBottomBar = $('.chat-bottpm-bar')
$chatBox = $('#chat-box')

class ChatBottom
	# 构造函数
	constructor: (@number) ->
	# 点击底部的聊天栏事件处理逻辑
	clickBottomHandler: ->
		$(this).hide()
		$chatBox.show()

		$('.chat-contact').last().click()

	# 隐藏底部的聊天栏
	closeChatBottom: ->
		$chatBox.hide()
		$chatBottomBar.show()

	# 设置底部未读栏的数字
	setChatBottomNumber: (messageNumber)->
        number = if messageNumber > 0 then '(' + messageNumber + ')' else ''
        $chatBottomBar.find('.message-number').text(number)

    # 如果当前页面有未读新消息，加载底部的聊天条
	loadChatBottomBar: ->
        $chatBottomBar.show()
        @setChatBottomNumber(@getUnread())

	# 获取当前为止未读消息
  	getUnread: ->
  		return @number
  	# 添加一条未读消息
  	addOneUnread: ->
  		@number += 1
  		@setChatBottomNumber(@getUnread())

  	# 阅读固定数量的消息
  	removeNumber: (value)->
  		@number -= value
  		@setChatBottomNumber(@getUnread())

  	# 设定未读数量的数目
  	setUnread: (newNumber)->
  		@number = newNumber

chatBottom = new ChatBottom(0)

# 返回组件实例，以便数据在不同模块之间共享
module.exports = chatBottom
