(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
调用方法 

behindUploader = new Uploader {
	domain: "http://7xj0sp.com1.z0.glb.clouddn.com/"	# bucket 域名，下载资源时用到，**必需**
	browse_button: 'negative-file',       # 上传选择的点选按钮，**必需**
	container: 'negative-wrapper',       # 上传选择的点选按钮，**必需**
}, {
	FileUploaded: (up, file, info)->
		info = $.parseJSON info
		domain = up.getOption('domain')

		$("#negative-wrapper").find(".content-img").removeClass("hidden").find("img").attr("src", domain + info.key)
		$("#negative-wrapper").find(".img-border").addClass("hidden")
}
	
构造函数的第一个参数对象包含了用来覆盖默认参数中除了init之外的各项属性的值
第二个参数对象包含了用来覆盖默认参数中init对象内方法的函数
未被指定的属性将以默认参数中的值进行传递
 */

/*
默认参数
 */
var Uploader, _defaultConfig;

_defaultConfig = {
  runtimes: 'html5,flash,html4',
  browse_button: 'click-file',
  uptoken_url: '/uptoken',
  domain: "http://7te9k1.com1.z0.glb.clouddn.com/",
  container: 'container',
  max_file_size: '5mb',
  flash_swf_url: '/lib/plupload/Moxie.swf',
  max_retries: 3,
  dragdrop: false,
  drop_element: 'container',
  chunk_size: '4mb',
  auto_start: true,
  unique_names: true,
  save_key: true,
  statusTip: '.image-upload-tips',
  init: {
    'Error': function(up, err, errTip) {
      return console.log(errTip);
    },
    'BeforeUpload': function(up, file) {
      return $(this.getOption().statusTip).text('准备上传图片');
    },
    'UploadProgress': function(up, file) {
      return $(this.getOption().statusTip).text('正在上传图片');
    },
    'FileUploaded': function(up, file, info) {
      var domain;
      info = $.parseJSON(info);
      return domain = up.getOption('domain');
    },
    'UploadComplete': function() {
      return $(this.getOption().statusTip).text('图片上传成功');
    }
  }
};

Uploader = (function() {
  function Uploader(options, handlers) {
    var callback, config, name, uploader;
    config = $.extend({}, _defaultConfig, options);
    for (name in handlers) {
      callback = handlers[name];
      config.init[name] = callback;
    }
    uploader = Qiniu.uploader(config);
  }

  return Uploader;

})();

module.exports = Uploader;


},{}],2:[function(require,module,exports){
var $QQ, $avatar, $avatarImg, $baseInfoSaveBtn, $female, $location, $male, $realname, $signature, $unknown, $wechat, Uploader, currentUser, isBirthday, isNumber, setUploadedAvatar, settingDataBus, updateUserInfo;

Uploader = require("../../common/uploader/index.coffee");

$avatar = $("#avatar");

$avatarImg = $("#avatarImg");

$realname = $('#realname');

$male = $('#male');

$female = $('#female');

$unknown = $("#unknown");

$wechat = $('#wechat');

$QQ = $('#QQ');

$location = $('#location');

$signature = $('#signature');

$baseInfoSaveBtn = $('#base-info-save-btn');

currentUser = $('#currentUser').val();

settingDataBus = {
  updateUserInfo: function(data, callback) {
    return $.post("/setting", data, function(data) {
      return callback(data);
    });
  }
};

isNumber = /^\d*$/;

isBirthday = /^\d{4}-\d{1,2}-\d{1,2}$/;

updateUserInfo = function(e) {
  var data, gender;
  if ($male[0].checked) {
    gender = 'male';
  }
  if ($female[0].checked) {
    gender = 'female';
  }
  if ($unknown[0].checked) {
    gender = 'secret';
  }
  if (!isNumber.test($QQ.val())) {
    alert("QQ号必须是数字");
    return false;
  }
  data = {
    avatar: $avatar.val(),
    name: $realname.val(),
    male: gender,
    wechat: $wechat.val(),
    qq: Math.floor($QQ.val()) === 0 ? '' : Math.floor($QQ.val()),
    location: $location.val(),
    signature: $signature.val()
  };
  return settingDataBus.updateUserInfo(data, function(res) {
    if (res.errCode === 200) {
      alert("修改个人信息成功");
      return window.location.href = '/user/' + currentUser;
    } else {
      console.log(res);
      return alert(res.message);
    }
  });
};

setUploadedAvatar = function(name) {
  var uploader;
  return uploader = new Uploader({
    domain: "http://7te9k1.com1.z0.glb.clouddn.com/",
    browse_button: 'revise-avatar',
    container: 'avatar-wrapper'
  }, {
    FileUploaded: function(up, file, info) {
      var domain, url;
      info = $.parseJSON(info);
      domain = up.getOption('domain');
      url = domain + info.key;
      console.log('fuck');
      $avatarImg.attr("src", url);
      return $avatar.val(url);
    }
  });
};

$(function() {
  var avatarUploader;
  $baseInfoSaveBtn.bind('click', updateUserInfo);
  return avatarUploader = setUploadedAvatar();
});


},{"../../common/uploader/index.coffee":1}]},{},[2]);