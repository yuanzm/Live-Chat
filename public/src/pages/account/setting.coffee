Uploader = require "../../common/uploader/index.coffee"

# 缓存DOM节点
$avatar = $("#avatar")
$avatarImg = $("#avatarImg")
$realname = $('#realname')
$male = $('#male')
$female = $('#female')
$unknown = $("#unknown")
$wechat = $('#wechat')
$QQ = $('#QQ')
$location = $('#location')
$signature = $('#signature')
$baseInfoSaveBtn = $('#base-info-save-btn')
currentUser = $('#currentUser').val()

# 更改个人信息数据模块
settingDataBus = 
	updateUserInfo: (data, callback)->
		$.post "/setting", data, (data)->
			callback data

# 正则表达式
isNumber = /^\d*$/
isBirthday = /^\d{4}-\d{1,2}-\d{1,2}$/

updateUserInfo = (e)->
	if $male[0].checked
		gender = 'male'
	if $female[0].checked
		gender = 'female'
	if $unknown[0].checked
		gender = 'secret'

	if not isNumber.test($QQ.val())
		alert("QQ号必须是数字")
		return false
	data = 
		avatar: $avatar.val()
		# avatar: '/public/images/static/avatar.jpg'
		name: $realname.val()
		male: gender
		wechat: $wechat.val()
		qq: if Math.floor($QQ.val()) is 0 then '' else Math.floor($QQ.val())
		location: $location.val()
		signature: $signature.val()

	settingDataBus.updateUserInfo data, (res)->
		if res.errCode == 200
			alert "修改个人信息成功"
			window.location.href = '/user/' + currentUser
		else 
			console.log res
			alert res.message

setUploadedAvatar = (name)->
	uploader = new Uploader {
		domain: "http://7te9k1.com1.z0.glb.clouddn.com/"	# bucket 域名，下载资源时用到，**必需**
		browse_button: 'revise-avatar',       # 上传选择的点选按钮，**必需**
		container: 'avatar-wrapper',       
	}, {
		FileUploaded: (up, file, info)->
			info = $.parseJSON info
			domain = up.getOption('domain')
			url = domain + info.key
			console.log('fuck')

			$avatarImg.attr("src", url)
			$avatar.val url
	}

$ ->
	$baseInfoSaveBtn.bind 'click', updateUserInfo
	avatarUploader = setUploadedAvatar()
