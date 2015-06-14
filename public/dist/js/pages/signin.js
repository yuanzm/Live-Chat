(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $loginBtn, $loginTips, $loginname, $password, loginBtnAction, loginBtnHandler, signInDataBus;

signInDataBus = {
  login: function(data, callback) {
    return $.ajax({
      type: 'post',
      url: '/signin',
      data: {
        password: data.password,
        loginname: data.loginname
      },
      success: function(data) {
        return callback(data);
      }
    });
  }
};

$loginname = $('#loginname');

$password = $('#password');

$loginBtn = $('#login-btn');

$loginTips = $('.login-tips');


/*
 * 页面加载完成执行的操作
 */

$(function() {
  return $('#login-btn').bind('click', loginBtnHandler);
});


/*
 * 点击登录按钮所执行的DOM操作
 *   1. 如果出未填信息，给出红色文字提示
 *   2. 如果用户的验证码错误，给出红色文字提示
 *   2. 如果信息都填写完成，清空文字提示，返回用户信息
 *
 */

loginBtnAction = function() {
  if (!$loginname.val() || !$password.val()) {
    $loginTips.removeClass('green-tip').addClass('red-tip').text('请填写完整信息');
    return false;
  } else {
    $loginTips.removeClass('green-tip').removeClass('red-tip').text('');
    return {
      password: $password.val(),
      loginname: $loginname.val()
    };
  }
};


/*
 * 点击登录按钮所执行的逻辑
 *   1. 判断用户是否输入完成，并且输入信息是否正确
 */

loginBtnHandler = function() {
  var loginInfo;
  loginInfo = loginBtnAction();
  console.log(loginInfo);
  if (loginInfo) {
    return signInDataBus.login(loginInfo, function(data) {
      console.log(data);
      if (data.errCode !== 0) {
        $loginTips.removeClass('green-tip').addClass('red-tip').text(data.message);
      }
      if (data.errCode === 0) {
        $loginTips.removeClass('red-tip').addClass('green-tip').text('登录成功');
        return setTimeout(function() {
          if (data.intendedUrl) {
            return location.href = data.intendedUrl;
          } else {
            return location.href = '/';
          }
        }, 1000);
      }
    });
  }
};


},{}]},{},[1]);