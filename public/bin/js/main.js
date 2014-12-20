(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $chatInput, $chatList, $chatPerson, $liveNumber, $liveUser, $name, $window, Socket, changeuser, chat, socket;

changeuser = require('./changeuser.coffee');

if (location.pathname === "/") {
  chat = require('./chat.coffee');
  $window = $(window);
  $name = $("#my-name");
  $liveUser = $('#live-user');
  $chatList = $('#chat-list');
  $chatInput = $('#chat-input');
  $chatPerson = $('#chat-person');
  $liveNumber = $('#live-number');
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
      _this.detectMessage();
      _this.detectPrivateMessage();
      changeuser.clickPerson();
      changeuser.clickToDeletePerson();
      return changeuser.changeChatingPerson();
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
        _this.freshUser(userNames);
        return _this.showUserNumber(data.userNumbers);
      });
    };

    Socket.prototype.sendMessage = function(data) {
      var chatPerson;
      chatPerson = $chatPerson.text();
      data.name = chatPerson;
      if (chatPerson === 'Live-Chat') {
        return socket.emit('new message', data);
      } else {
        return socket.emit('private chat', data);
      }
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

    Socket.prototype.detectPrivateMessage = function() {
      var _this;
      _this = this;
      return socket.on('private message', function(data) {
        return alert(data.userName + '对你说' + data.message);
      });
    };

    Socket.prototype.detectNewUser = function() {
      var _this;
      _this = this;
      return socket.on('new user', function(data) {
        var userNames;
        userNames = data.userNames;
        _this.freshUser(userNames);
        return _this.showUserNumber(data.userNumbers);
      });
    };

    Socket.prototype.detectUserLeft = function() {
      var _this;
      _this = this;
      return socket.on('user left', function(data) {
        var userNames;
        userNames = data.userNames;
        _this.freshUser(userNames);
        return _this.showUserNumber(data.userNumbers);
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

    Socket.prototype.showUserNumber = function(num) {
      return $liveNumber.text(num);
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



},{"./changeuser.coffee":2,"./chat.coffee":3}],2:[function(require,module,exports){
var $chatLeft, $chatPerson, $chatingUser, $liveUser, $myName, $window, Changeuser, chatingUsers;

if (location.pathname === "/") {
  $window = $(window);
  $liveUser = $('#live-user');
  $chatPerson = $('#chat-person');
  $chatLeft = $('#chat-left');
  $chatingUser = $('#chating-user');
  $myName = $('#my-name').text();
  chatingUsers = 0;
  Changeuser = {
    getSelfName: function() {
      var selfName;
      return selfName = $myName;
    },
    clickPerson: function() {
      var _this;
      _this = this;
      return $liveUser.delegate('span', 'click', function() {
        var isChating, name, selfName;
        name = this.innerHTML;
        selfName = _this.getSelfName();
        isChating = _this.detectIsChatting();
        if (name !== selfName) {
          _this.addChatPerson(name);
          ++chatingUsers;
          if (!isChating) {
            return $chatLeft.addClass('is-chating');
          }
        }
      });
    },
    addChatPerson: function(name) {
      var chatDiv;
      chatDiv = '<li>';
      chatDiv += '<span>' + name + '</span>';
      chatDiv += '<div class="close-chating">';
      chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>';
      chatDiv += '</li>';
      return $chatingUser.find('ul').append($(chatDiv));
    },
    removeChatPerson: function(name) {
      var allChatingUser, user, _i, _len, _results;
      allChatingUser = $chatingUser.find('li');
      _results = [];
      for (_i = 0, _len = allChatingUser.length; _i < _len; _i++) {
        user = allChatingUser[_i];
        if ($(user).text() === name) {
          _results.push($(user).remove());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    },
    clickToDeletePerson: function() {
      var _this;
      _this = this;
      return $chatingUser.delegate('.close-chating', 'click', function() {
        var name;
        name = $(this).parent().text();
        --chatingUsers;
        _this.removeChatPerson(name);
        if (chatingUsers === 0) {
          _this.nameChatingPerson('Live-Chat');
          return $chatLeft.removeClass('is-chating');
        }
      });
    },
    changeChatingPerson: function() {
      var _this;
      _this = this;
      return $chatingUser.delegate('span', 'click', function() {
        var name;
        name = $(this).text();
        return _this.nameChatingPerson(name);
      });
    },
    detectIsChatting: function() {
      var isChating;
      return isChating = chatingUsers === 0 ? false : true;
    },
    keybordchange: function() {},
    addNotice: function() {},
    nameChatingPerson: function(name) {
      console.log(name);
      return $chatPerson.text(name);
    }
  };
  module.exports = Changeuser;
}



},{}],3:[function(require,module,exports){
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



},{}],4:[function(require,module,exports){
var Socket, chat, socket;

chat = require("./chat.coffee");

Socket = require("./Socket.coffee");

socket = new Socket();

socket.init();



},{"./Socket.coffee":1,"./chat.coffee":3}]},{},[4]);
