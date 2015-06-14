signUpDataBus =
	signup: (data, callback)->
		$.ajax {
			type: 'post'
			url: '/signup'
			data: 
				password: data.password
				rePassword: data.rePassword
				loginname: data.loginname
				avatar: "/public/images/static/avatar.jpg"
				email: data.email

			success: (data)->
				callback(data)
		}

# 缓存DOM节点变量
$loginname = $('#loginname')
$email = $('#email')
$password = $('#password')
$rePassword = $('#re-password')
$signupBtn = $('#signup-btn')
$signupTips = $('.signup-tips')

###
# 页面加载完成执行的操作
###
$ ->
	$signupBtn.bind 'click', signUpBtnHandler

###
# 点击登录按钮所执行的DOM操作
#   1. 如果出未填信息，给出红色文字提示
#   2. 如果用户的验证码错误，给出红色文字提示
#   2. 如果信息都填写完成，清空文字提示，返回用户信息
#   
###
signUpBtnAction = ->
    if not $loginname.val() or not $password.val() or not $rePassword.val() or not $email.val()
    	$signupTips.removeClass('green-tip').addClass('red-tip').text('请填写完整信息')
    	return false
    else
    	$signupTips.removeClass('green-tip').removeClass('red-tip').text('')
    	return {
    		password: $password.val()
    		loginname: $loginname.val()
    		email: $email.val()
    		rePassword: $rePassword.val()
    	}
###
# 点击登录按钮所执行的逻辑
#   1. 判断用户是否输入完成，并且输入信息是否正确
###
signUpBtnHandler = ->
	signupInfo = signUpBtnAction()
	if signupInfo
	    signUpDataBus.signup signupInfo, (data)->
	        console.log data
	        if data.errCode isnt 200
	            $signupTips.removeClass('green-tip').addClass('red-tip').text(data.message)
	        if data.errCode is 200
	            $signupTips.removeClass('red-tip').addClass('green-tip').text('注册成功')
	            setTimeout ->
	                location.href = '/chat'
	            , 1000
