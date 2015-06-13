# 用于实时显示未读消息
class Unread
	# 构造函数
  	constructor: (@number) ->
  		
  	# 获取当前为止未读消息
  	getUnread: ->
  		return @number

  	# 添加一条未读消息
  	addOneUnread: ->
  		@number += 1

  	# 阅读固定数量的消息
  	removeNumber: (value)->
  		@number -= value

  	# 设定未读数量的数目
  	setUnread: (newNumber)->
  		@number = newNumber
  		
unread = new Unread(0)

module.exports = unread
