(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $email, $loginname, $password, $rePassword, $signupBtn, $signupTips, signUpBtnAction, signUpBtnHandler, signUpDataBus;

signUpDataBus = {
  signup: function(data, callback) {
    return $.ajax({
      type: 'post',
      url: '/signup',
      data: {
        password: data.password,
        rePassword: data.rePassword,
        loginname: data.loginname,
        avatar: "/public/images/static/avatar.jpg",
        email: data.email
      },
      success: function(data) {
        return callback(data);
      }
    });
  }
};

$loginname = $('#loginname');

$email = $('#email');

$password = $('#password');

$rePassword = $('#re-password');

$signupBtn = $('#signup-btn');

$signupTips = $('.signup-tips');


/*
 * 页面加载完成执行的操作
 */

$(function() {
  return $signupBtn.bind('click', signUpBtnHandler);
});


/*
 * 点击登录按钮所执行的DOM操作
 *   1. 如果出未填信息，给出红色文字提示
 *   2. 如果用户的验证码错误，给出红色文字提示
 *   2. 如果信息都填写完成，清空文字提示，返回用户信息
 *
 */

signUpBtnAction = function() {
  if (!$loginname.val() || !$password.val() || !$rePassword.val() || !$email.val()) {
    $signupTips.removeClass('green-tip').addClass('red-tip').text('请填写完整信息');
    return false;
  } else {
    $signupTips.removeClass('green-tip').removeClass('red-tip').text('');
    return {
      password: $password.val(),
      loginname: $loginname.val(),
      email: $email.val(),
      rePassword: $rePassword.val()
    };
  }
};


/*
 * 点击登录按钮所执行的逻辑
 *   1. 判断用户是否输入完成，并且输入信息是否正确
 */

signUpBtnHandler = function() {
  var signupInfo;
  signupInfo = signUpBtnAction();
  if (signupInfo) {
    return signUpDataBus.signup(signupInfo, function(data) {
      console.log(data);
      if (data.errCode !== 200) {
        $signupTips.removeClass('green-tip').addClass('red-tip').text(data.message);
      }
      if (data.errCode === 200) {
        $signupTips.removeClass('red-tip').addClass('green-tip').text('注册成功');
        return setTimeout(function() {
          return location.href = '/chat';
        }, 1000);
      }
    });
  }
};


},{}]},{},[1]);