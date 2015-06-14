signInDataBus =
	login: (data, callback)->
		$.ajax {
			type: 'post'
			url: '/signin'
			data: 
				password: data.password
				loginname: data.loginname
			success: (data)->
				callback(data)
		}

# 缓存DOM节点变量
$loginname = $('#loginname')
$password = $('#password')
$loginBtn = $('#login-btn')
$loginTips = $('.login-tips')

###
# 页面加载完成执行的操作
###
$ ->
	$('#login-btn').bind 'click', loginBtnHandler

###
# 点击登录按钮所执行的DOM操作
#   1. 如果出未填信息，给出红色文字提示
#   2. 如果用户的验证码错误，给出红色文字提示
#   2. 如果信息都填写完成，清空文字提示，返回用户信息
#   
###
loginBtnAction = ->
    if not $loginname.val() or not $password.val()
    	$loginTips.removeClass('green-tip').addClass('red-tip').text('请填写完整信息')
    	return false
    else
    	$loginTips.removeClass('green-tip').removeClass('red-tip').text('')
    	return {
    		password: $password.val()
    		loginname: $loginname.val()
    	}
###
# 点击登录按钮所执行的逻辑
#   1. 判断用户是否输入完成，并且输入信息是否正确
###
loginBtnHandler = ->
	loginInfo = loginBtnAction()
	console.log loginInfo
	if loginInfo
	    signInDataBus.login loginInfo, (data)->
	        console.log data
	        if data.errCode isnt 0
	            $loginTips.removeClass('green-tip').addClass('red-tip').text(data.message)
	        if data.errCode is 0
	            $loginTips.removeClass('red-tip').addClass('green-tip').text('登录成功')
	            setTimeout ->
	                if data.intendedUrl
	                    location.href = data.intendedUrl
	                else 
	                    location.href = '/'
	            , 1000
