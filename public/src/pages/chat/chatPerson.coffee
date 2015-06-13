# 维护当前聊天用户的类
class ChatPerson
	# 构造函数
  	constructor: (@id) ->

  	# 获取当前正在聊天的对象
  	getChatId:  ->
    	return @id

   	# 设置新的聊天对象
    setChatId: (newId)->
    	@id = newId

toId = $('#to-userid').val()

person = new ChatPerson(toId)

module.exports = person
