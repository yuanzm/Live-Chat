# 正在聊天的用户模块

# 引入所需模块
tpl = require './tpl.coffee'
person = require './chatPerson.coffee'
chatConnect = require './chatConnect.coffee'
chattingList = require './chattingList.coffee'

# 缓存DOM节点变量
$allLiveUser = $('.all-live-user')
currentId = $('#current-userid').val()
$chatBottomBar = $('.chat-bottpm-bar')
chatBottom = require './chatBottom.coffee'

liveList =
	# 判断一个用户是否在列表中
	getIndexInTheChatList: (id)->
	    flag = false

	    $('.live-contact').each (index, item)->
          	id = id
          	userIndex = $(item).find('.user-name').data('userid')
          	if userIndex is id
            	flag = index

	    return flag

	# 将一个用户添加到在线列表 
	addUserToLiveList: (userid, name)->
		oneUser = {
			userid: userid,
			name: name
		}
		str = $(tpl.oneLiveCompile(oneUser));
		$allLiveUser.append str

	# 将一个用户从在线列表中删除
	removeOneUser: (id)->
		index = liveList.getIndexInTheChatList(id)
		if index isnt false
			$('.live-contact').eq(index).fadeOut().remove();
			
	# 在线用户列表点击事件
	liveUserClickHandler: ->
		$this = $(this)
		id = $this.find('.user-name').data('userid')
		toUserName = $this.find('.user-name').text()
		index = chattingList.getIndexInTheChatList(id)
		toAvatar = $this.find('.chat-avatar').attr('src')
		if id isnt currentId
			if index is false
				person.setChatId(id)
				chattingList.addUserToChatList(toUserName, id, toAvatar, 'on', true);
				$('.chat-contact').eq($('.chat-contact').length - 1).click()

module.exports = liveList
