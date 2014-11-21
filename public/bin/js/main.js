(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $chatInput, $chatList, $liveUser, $name, $window, Socket, chat, socket;

if (location.pathname === "/") {
  chat = require('./chat.coffee');
  $window = $(window);
  $name = $("#my-name");
  $liveUser = $('#live-user');
  $chatList = $('#chat-list');
  $chatInput = $('#chat-input');
  socket = io();
  Socket = (function() {
    function Socket() {}

    Socket.prototype.init = function() {
      var _this;
      _this = this;
      _this.loginMessage();
      _this.keyDownEvent();
      _this.successSendMessage();
      _this.detectNewUser();
      _this.successionLoginMessage();
      _this.detectUserLeft();
      return _this.detectMessage();
    };

    Socket.prototype.keyDownEvent = function() {
      var _this;
      _this = this;
      return $window.keydown(function(event) {
        var data;
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
          $chatInput.focus();
        }
        if (event.which === 13) {
          data = {
            time: chat.getTime(),
            userName: $name.text(),
            message: $chatInput.val()
          };
          $chatInput.val('');
          _this.sendMessage(data);
          return $.ajax({
            type: "POST",
            url: '/addChat',
            data: data,
            success: function(data) {}
          });
        }
      });
    };

    Socket.prototype.loginMessage = function() {
      return socket.emit('join');
    };

    Socket.prototype.successionLoginMessage = function() {
      var _this;
      _this = this;
      return socket.on('success login', function(data) {
        var userNames;
        userNames = data.userNames;
        return _this.freshUser(userNames);
      });
    };

    Socket.prototype.sendMessage = function(data) {
      return socket.emit('new message', data);
    };

    Socket.prototype.successSendMessage = function(data) {
      var _this;
      _this = this;
      return socket.on('send message', function(data) {
        return _this.showMessage(data);
      });
    };

    Socket.prototype.detectMessage = function() {
      var _this;
      _this = this;
      return socket.on('message', function(data) {
        return _this.showMessage(data);
      });
    };

    Socket.prototype.detectNewUser = function() {
      var _this;
      _this = this;
      return socket.on('new user', function(data) {
        var userNames;
        userNames = data.userNames;
        return _this.freshUser(userNames);
      });
    };

    Socket.prototype.detectUserLeft = function() {
      var _this;
      _this = this;
      return socket.on('user left', function(data) {
        var userNames;
        userNames = data.userNames;
        return _this.freshUser(userNames);
      });
    };

    Socket.prototype.freshUser = function(userNames) {
      var name, _results, _this;
      _this = this;
      $liveUser.empty();
      _results = [];
      for (name in userNames) {
        _results.push(_this.showNewUser(name));
      }
      return _results;
    };

    Socket.prototype.showNewUser = function(userName) {
      var aUser;
      aUser = '<li>';
      aUser += '<span>' + userName + '</li>';
      aUser += '</li>';
      return $liveUser.append($(aUser));
    };

    Socket.prototype.showMessage = function(data) {
      var aChat;
      aChat = '<li>';
      aChat += '<span>' + data.userName + '</span>';
      aChat += '<span>' + data.time + '</span>';
      aChat += '<br />';
      aChat += '<span>' + data.message + '</span>';
      aChat += '</li>';
      return $chatList.append($(aChat));
    };

    return Socket;

  })();
  module.exports = Socket;
}



},{"./chat.coffee":2}],2:[function(require,module,exports){
var chat;

Date.prototype.Format = function(fmt) {
  var flag, k, o;
  o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, flag = RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};

chat = {
  showMessage: function(node, data) {
    var $chatList;
    $chatList = $('<li class="a-chat">test</li>');
    return node.append($chatList);
  },
  getTime: function() {
    var time;
    return time = new Date().Format("yyyy-MM-dd hh:mm:ss");
  }
};

module.exports = chat;



},{}],3:[function(require,module,exports){
var Socket, chat, socket;

chat = require("./chat.coffee");

Socket = require("./Socket.coffee");

socket = new Socket();

socket.init();



},{"./Socket.coffee":1,"./chat.coffee":2}]},{},[3]);
