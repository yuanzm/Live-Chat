(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $chatPerson, $chatingUser, chatingUser;

if (location.pathname === "/") {
  $chatingUser = $('#chating-user');
  $chatPerson = $('#chat-person');

  /*
  	* event handlers bind to chating userx
   */
  chatingUser = {
    init: function() {},
    clickToDeletePerson: function() {
      var self;
      self = this;
      return $chatingUser.delegate('.close-chating', 'click', function() {
        var name;
        name = $(this).parent().text();
        --chatingUsers;
        self.removeChatPerson(name);
        if (chatingUsers === 0) {
          self.nameChatingPerson('Live-Chat');
          return $chatLeft.removeClass('is-chating');
        }
      });
    },
    changeChatingPerson: function() {
      var self;
      self = this;
      return $chatingUser.delegate('span', 'click', function() {
        var name;
        name = $(this).text();
        return self.nameChatingPerson(name);
      });
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
    keybordchange: function() {},
    addNotice: function() {}
  };
  module.exports = chatingUser;
}



},{}],2:[function(require,module,exports){
var $gravatar, Connect, helper, socket;

if (location.pathname === "/") {
  helper = require('./helper.coffee');
  $gravatar = $('#gravatar');
  socket = io();

  /*
  	* A class to track the connection status
   */
  Connect = (function() {
    function Connect() {}

    Connect.prototype.init = function() {
      var _this;
      _this = this;
      _this.loginMessage();
      _this.detectNewUser();
      _this.successionLoginMessage();
      return _this.detectUserLeft();
    };


    /*
    		* if user refresh page or login,send message to server
     */

    Connect.prototype.loginMessage = function() {
      return socket.emit('join', $gravatar.attr('src'));
    };


    /*
    		* if user login success or refresh page,refresh live users list and live users number
     */

    Connect.prototype.successionLoginMessage = function() {
      var _this;
      _this = this;
      return socket.on('success login', function(data) {
        var allUser;
        return allUser = data.allUser;
      });
    };

    Connect.prototype.detectNewUser = function() {
      var _this;
      _this = this;
      return socket.on('new user', function(data) {
        var allUser;
        return allUser = data.allUser;
      });
    };

    Connect.prototype.detectUserLeft = function() {
      var _this;
      _this = this;
      return socket.on('user left', function(data) {
        var allUser;
        return allUser = data.allUser;
      });
    };

    return Connect;

  })();
  module.exports = Connect;
}



},{"./helper.coffee":3}],3:[function(require,module,exports){
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
var $chatLeft, $chatPerson, $chatingUser, $liveUser, $myName, $name, $window, chatingUsers, liveUser;

if (location.pathname === "/") {
  $window = $(window);
  $liveUser = $('#live-user');
  $chatPerson = $('#chat-person');
  $chatLeft = $('#chat-left');
  $chatingUser = $('#chating-user');
  $myName = $('#my-name').text();
  chatingUsers = 0;
  $name = $("#my-name");

  /*
  	* event handlers bind to live users
   */
  liveUser = {

    /*
    		* initialize instance
     */
    init: function() {
      return this.bindEventHandler();
    },

    /*
    		* initialize all the event handlers
     */
    bindEventHandler: function() {
      return this.clickPerson();
    },

    /*
    		* get self name through nickname
     */
    getSelfName: function() {
      var selfName;
      return selfName = $myName;
    },

    /*
    		* bind event handler to live user
    		* if the user clicked is self,nothing happen
    		* if the user clicked is already in chating list,nothing happen
    		* if the user clicked is not self and not in chating list,add it to the chating list
    		* if the user added to the chating list is the first one,show the chating list
     */
    clickPerson: function() {
      var self;
      self = this;
      return $liveUser.delegate('li', 'click', function() {
        var chatNum, chatUser, gravatar, isChating, name, selfName;
        name = $(this).find('span').text();
        gravatar = $(this).find('img').attr('src');
        selfName = self.getSelfName();
        isChating = self.detectIsChatting(gravatar);
        chatNum = self.checkChatingNum();
        if (name !== selfName && isChating === false) {
          chatUser = {
            name: name,
            gravatar: gravatar
          };
          self.addChatPerson(chatUser);
          self.nameChatingPerson(name);
          ++chatingUsers;
          if (!chatNum) {
            return $chatLeft.addClass('is-chating');
          }
        }
      });
    },

    /*
    		* display the chat user in chating list
    		* @param {Object} chatUser: the user data of chat user
     */
    addChatPerson: function(chatUser) {
      var chatDiv;
      chatDiv = '<li>';
      chatDiv += '<span></span>';
      chatDiv += '<img class="gravatar" src="' + chatUser.gravatar + '">';
      chatDiv += '<div class="close-chating">';
      chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>';
      chatDiv += '</div></li>';
      return $chatingUser.find('ul').append($(chatDiv));
    },
    detectIsChatting: function(gravatar) {
      var $allChatingUser, isChating;
      isChating = false;
      $allChatingUser = $chatingUser.find('img');
      $allChatingUser.each(function() {
        if ($(this).attr('src') === gravatar) {
          return isChating = true;
        }
      });
      return isChating;
    },
    checkChatingNum: function() {
      return $chatingUser.find('img').length;
    },
    nameChatingPerson: function(name) {
      return $chatPerson.text(name);
    },
    freshUser: function(allUser) {
      var user, userData, _results, _this;
      _this = this;
      $liveUser.empty();
      _results = [];
      for (user in allUser) {
        userData = allUser[user];
        _results.push(_this.showNewUser(userData));
      }
      return _results;
    },
    showNewUser: function(userData) {
      var aUser;
      aUser = '<li>';
      aUser += '<img class="gravatar" src="';
      aUser += userData.gravatar;
      aUser += '">';
      aUser += '<span>' + userData.name + '</span>';
      aUser += '</li>';
      return $liveUser.append($(aUser));
    },
    showUserNumber: function(num) {
      return $liveNumber.text(num);
    }
  };
  module.exports = liveUser;
}



},{}],5:[function(require,module,exports){
var Connect, chatingUser, liveUser;

Connect = require("./connect-status.coffee");

liveUser = require("./live-user.coffee");

chatingUser = require("./chating-user.coffee");

Connect = new Connect();

Connect.init();

liveUser.init();

chatingUser.init();



},{"./chating-user.coffee":1,"./connect-status.coffee":2,"./live-user.coffee":4}]},{},[5]);
