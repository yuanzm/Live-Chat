(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LiveChat;

LiveChat = {
  name: 'Live-Chat',
  gravatar: 'https://avatars3.githubusercontent.com/u/6168796?v=3&s=48'
};

module.exports = LiveChat;



},{}],2:[function(require,module,exports){
var $chatLeft, $chatPerson, $chatingUser, $name, LiveChat, LiveUser, Status, UserDom, chatingUser;

if (location.pathname === "/") {
  $chatingUser = $('#chating-user');
  $chatPerson = $('#chat-person');
  $chatLeft = $('#chat-left');
  $name = $("#my-name");
  Status = require('./maintain-chating.coffee');
  LiveUser = require('./live-user.coffee');
  UserDom = require('./user-dom.coffee');
  LiveChat = require('./LiveChat-config.coffee');

  /*
  	* event handlers bind to chating userx
   */
  chatingUser = {
    init: function() {
      this.clickToDeletePerson();
      this.changeChatingPerson();
      this.removeChatPerson();
      return this.getChatList();
    },

    /*
    		* when login successful or refresh page, load the chat list and display on the page
     */
    getChatList: function() {
      var name, self;
      name = $name.text();
      self = this;
      return Status.getChatPersonsData(name, function(data) {
        var chatNow, index, isChating, user, _i, _len;
        isChating = data.isChating;
        chatNow = data.chatNow;
        if (isChating.length) {
          $chatLeft.addClass('is-chating');
          LiveUser.addChatPerson(LiveChat);
          for (_i = 0, _len = isChating.length; _i < _len; _i++) {
            user = isChating[_i];
            LiveUser.addChatPerson(user);
            LiveUser.userCollection[user.name] = new LiveUser.OneUser(user.name);
          }
          if (chatNow.length) {
            index = UserDom.getUserIndex(chatNow);
            UserDom.markChatingNowUser(index);
            self.nameChatingPerson(chatNow);
          }
          return console.log(LiveUser.userCollection);
        }
      });
    },

    /*
    		* get the chating users number
     */
    checkChatingNum: function() {
      return $chatingUser.find('img').length;
    },

    /*
    		* click to delete a chating user
     */
    clickToDeletePerson: function(event) {
      var self;
      self = this;
      return $chatingUser.delegate('.close-chating', 'click', function() {
        var chatingNum, name;
        name = $(this).parent().text();
        self.removeChatPerson(name);
        Status.removeUserFromChatList($name.text(), name, function(data) {});
        chatingNum = self.checkChatingNum();
        if (chatingNum === 1) {
          self.nameChatingPerson('Live-Chat');
          $chatLeft.removeClass('is-chating');
        }
        return event.stopPropagation();
      });
    },

    /*
    		* click a user in chating users list to switch chating user
     */
    changeChatingPerson: function() {
      var self;
      self = this;
      return $chatingUser.delegate('li', 'click', function() {
        var index, name;
        name = $(this).find('.chat-user-name').text();
        Status.updateChatingNowPerson($name.text(), name, function(data) {});
        self.nameChatingPerson(name);
        index = UserDom.getUserIndex(name);
        UserDom.markChatingNowUser(index);
        return Status.getTwenty($name.text(), name, 0, 3, function(data) {
          return console.log(data);
        });
      });
    },

    /*
    		* remove a user in chating users list
     */
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

    /*
    		* switch the chating user through keyboard
     */
    keybordchange: function() {},

    /*
    		* display the chating user
     */
    nameChatingPerson: function(name) {
      return $chatPerson.text(name);
    }
  };
  module.exports = {
    chatingUser: chatingUser
  };
}



},{"./LiveChat-config.coffee":1,"./live-user.coffee":5,"./maintain-chating.coffee":7,"./user-dom.coffee":10}],3:[function(require,module,exports){
var $gravatar, Connect, helper, liveUser, socket;

if (location.pathname === "/") {
  helper = require('./helper.coffee');
  liveUser = require('./live-user.coffee');
  $gravatar = $('#gravatar');
  socket = io();

  /*
  	* A class to track the connection status
   */
  Connect = (function() {
    function Connect() {}

    Connect.prototype.init = function() {
      var self;
      self = this;
      self.loginMessage();
      self.detectNewUser();
      self.successionLoginMessage();
      return self.detectUserLeft();
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
      var self;
      self = this;
      return socket.on('success login', function(data) {
        var allUser;
        allUser = data.allUser;
        liveUser.freshUser(allUser);
        return liveUser.showUserNumber(data.userNumbers);
      });
    };


    /*
    		* detect whether a new user is join to chat room
     */

    Connect.prototype.detectNewUser = function() {
      var self;
      self = this;
      return socket.on('new user', function(data) {
        var allUser;
        allUser = data.allUser;
        liveUser.freshUser(allUser);
        return liveUser.showUserNumber(data.userNumbers);
      });
    };

    Connect.prototype.detectUserLeft = function() {
      var self;
      self = this;
      return socket.on('user left', function(data) {
        var allUser;
        allUser = data.allUser;
        liveUser.freshUser(allUser);
        return liveUser.showUserNumber(data.userNumbers);
      });
    };

    return Connect;

  })();
  module.exports = Connect;
}



},{"./helper.coffee":4,"./live-user.coffee":5}],4:[function(require,module,exports){
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



},{}],5:[function(require,module,exports){
var $chatLeft, $chatPerson, $chatingUser, $liveNumber, $liveUser, $myName, $name, $window, LiveChat, OneUser, Status, UserDom, liveUser;

if (location.pathname === "/") {
  $window = $(window);
  $liveUser = $('#live-user');
  $chatPerson = $('#chat-person');
  $chatLeft = $('#chat-left');
  $chatingUser = $('#chating-user');
  $myName = $('#my-name').text();
  $name = $("#my-name");
  $liveNumber = $('#live-number');
  Status = require('./maintain-chating.coffee');
  UserDom = require('./user-dom.coffee');
  LiveChat = require('./LiveChat-config.coffee');

  /*
  	* event handlers bind to live users
   */
  liveUser = {

    /*
    		* initialize instance
     */
    init: function() {
      var self;
      this.bindEventHandler();
      self = this;
      return setTimeout(self.showCollection, 2000, self);
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
        var chatNum, chatUser, index, isChating, selfName;
        chatUser = {
          name: $(this).find('span').text(),
          gravatar: $(this).find('img').attr('src')
        };
        selfName = self.getSelfName();
        isChating = self.detectIsChatting(chatUser.name);
        chatNum = self.checkChatingNum();
        if (chatUser.name !== selfName && isChating === false) {
          if (!chatNum) {
            $chatLeft.addClass('is-chating');
            self.addChatPerson(LiveChat);
          }
          self.addChatPerson(chatUser);
          self.nameChatingPerson(chatUser.name);
          index = UserDom.getUserIndex(chatUser.name);
          UserDom.markChatingNowUser(index);
          Status.getEverChat(selfName, chatUser.name, function(data) {
            if (data === false) {
              return Status.insertChater(selfName, chatUser.name, function(data) {});
            }
          });
          Status.addChatPerson(selfName, chatUser, function(data) {});
          return Status.updateChatingNowPerson(selfName, chatUser.name, function(data) {});
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
      chatDiv += '<span class="chat-user-name">' + chatUser.name + '</span>';
      chatDiv += '<img class="gravatar" src="' + chatUser.gravatar + '">';
      chatDiv += '<div class="close-chating">';
      chatDiv += '<span class="glyphicon glyphicon-remove-circle"></span>';
      chatDiv += '</div></li>';
      return $chatingUser.find('ul').append($(chatDiv));
    },
    detectIsChatting: function(name) {
      var $allChatingUser, isChating;
      isChating = false;
      $allChatingUser = $chatingUser.find('span.chat-user-name');
      $allChatingUser.each(function() {
        if ($(this).text() === name) {
          return isChating = true;
        }
      });
      return isChating;
    },
    checkChatingNum: function() {
      return $chatingUser.find('img').length;
    },

    /*
    		* display the chating user
     */
    nameChatingPerson: function(name) {
      return $chatPerson.text(name);
    },

    /*
    		* show all the users live
    		* @param {Object} allUser: an object contain all the live users data
     */
    freshUser: function(allUser) {
      var self, user, userData, _results;
      self = this;
      $liveUser.empty();
      _results = [];
      for (user in allUser) {
        userData = allUser[user];
        _results.push(self.showNewUser(userData));
      }
      return _results;
    },

    /*
    		* display all the users live
    		* @param {Object} userData: user detail data
     */
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

    /*
    		* display live users number
    		* @param {String} num: a string of live users number
     */
    showUserNumber: function(num) {
      return $liveNumber.text(num);
    },
    OneUser: OneUser = (function() {
      function OneUser(name) {
        this.name = name;
        this.chatStart = 0;
        this.chatLimit = 20;
        this.chatLStatus = 'live';
      }

      return OneUser;

    })(),
    userCollection: [],
    showCollection: function(self) {}
  };
  module.exports = liveUser;
}



},{"./LiveChat-config.coffee":1,"./maintain-chating.coffee":7,"./user-dom.coffee":10}],6:[function(require,module,exports){
var Connect, chatingUser, connect, liveUser, messageSend, sender;

Connect = require("./connect-status.coffee");

liveUser = require("./live-user.coffee");

chatingUser = require("./chating-user.coffee").chatingUser;

messageSend = require("./message-send.coffee");

connect = new Connect;

connect.init();

liveUser.init();

chatingUser.init();

sender = new messageSend();

sender.init();



},{"./chating-user.coffee":2,"./connect-status.coffee":3,"./live-user.coffee":5,"./message-send.coffee":9}],7:[function(require,module,exports){
var $chatPerson, chatingState;

$chatPerson = $('#chat-person');

chatingState = {

  /*
  * When a user login successful or refresh page, 
  * query the users in the chat list
  * @param {String} name: the name we need to query
  * @param {Function} callback: a function will fire when load the data successfully
   */
  getChatPersonsData: function(name, callback) {
    var url;
    url = "/chat/" + name + '/chat-person';
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data) {
        return callback(data);
      }
    });
  },

  /*
  * Change the chating now user
  * @param {String} myname: the name of an entity of collection 'allPersonChat'
  * @param {String} name: the name we update with
  * @param {Function} callback: a function will fire after the update
   */
  updateChatingNowPerson: function(myname, name, callback) {
    var data, url;
    url = '/chat/' + myname + '/update-chating-person/' + name;
    data = {
      "myname": myname,
      "name": name
    };
    return $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function(data) {
        return callback(data);
      }
    });
  },

  /*
  * when click ‘click button’ in the upper right corner of a chating user
  * remove him from the chating users at the database level
   */
  removeUserFromChatList: function(myname, name, callback) {
    var url;
    url = '/chat/' + myname + '/remove-user/' + name;
    console.log(url);
    return $.ajax({
      type: "DELETE",
      url: url
    });
  },

  /*
  * If an user click a live user to chat with,
  * insert him to the history chat person at the database level
   */
  addChatPerson: function(myname, userData, callback) {
    var data, url;
    url = '/chat/' + myname + '/add-chat-person/' + userData.name;
    data = {
      myname: myname,
      userData: userData
    };
    return $.ajax({
      type: 'POST',
      url: url,
      data: data
    });
  },

  /*
  * Check the name of user we chating with,then we can now whether we are at `private chat` mode
   */
  isPrivateChat: function() {
    var isPrivate;
    return isPrivate = $chatPerson.text() === 'Live-Chat' ? false : true;
  },
  loadHistory: function(num) {},
  getEverChat: function(myname, name, callback) {
    var url;
    url = '/chat/' + myname + '/check-ever-chat/' + name;
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data) {
        return callback(data);
      }
    });
  },
  insertChater: function(myname, name, callback) {
    var data, url;
    url = '/chat/' + myname + '/insert-chater/' + name;
    data = {
      name: name,
      myname: myname
    };
    return $.ajax({
      type: "POST",
      url: url,
      data: data,
      success: function(data) {
        return callback(data);
      }
    });
  },
  getTwenty: function(myname, name, start, end, callback) {
    var url;
    url = '/chat/' + myname + '/get-chat/' + name + '/' + start + '/' + end;
    return $.ajax({
      type: "GET",
      url: url,
      success: function(data) {
        return callback(data);
      }
    });
  }
};

module.exports = chatingState;



},{}],8:[function(require,module,exports){
var $chatList, MessageReceive, socket;

if (location.pathname === "/") {
  $chatList = $('#chat-list');
  socket = io();
  MessageReceive = {
    init: function() {
      this.detectPrivateMessage();
      return this.detectMessage();
    },
    detectMessage: function() {
      var self;
      self = this;
      return socket.on('message', function(messageData) {
        return self.showMessage(messageData);
      });
    },
    detectPrivateMessage: function() {
      var self;
      self = this;
      return socket.on('private message', function(data) {
        return self.showMessage(data);
      });
    },
    showMessage: function(data) {
      var aChat;
      aChat = '<li>';
      aChat += '<img class="gravatar" src="' + data.receiverData.gravatar + '">';
      aChat += '<span>' + data.userName + '</span>';
      aChat += '<br />';
      aChat += '<span>' + data.message + '</span>';
      aChat += '</li>';
      console.log(234234);
      return $chatList.append($(aChat));
    }
  };
  module.exports = MessageReceive;
}



},{}],9:[function(require,module,exports){
var $chatInput, $chatPerson, $gravatar, $name, $window, MessageSend, Receiver, Status, helper, socket;

if (location.pathname === "/") {
  Receiver = require("./message-receive.coffee");
  helper = require("./helper.coffee");
  Status = require("./maintain-chating.coffee");
  $window = $(window);
  $chatInput = $('#chat-input');
  $name = $('#my-name');
  $chatPerson = $('#chat-person');
  $gravatar = $('#gravatar');
  socket = io();
  Receiver.init();
  MessageSend = (function() {
    function MessageSend() {}

    MessageSend.prototype.init = function() {
      this.keyDownEvent();
      return this.successSendMessage();
    };


    /*
    		* keyboard events
     */

    MessageSend.prototype.keyDownEvent = function() {
      var self;
      self = this;
      return $window.keydown(function(event) {
        var data, receiverData;
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
          $chatInput.focus();
        }
        if (event.which === 13) {

          /*
          					* detail of message,including the sender's name and message content
           */
          data = {
            time: helper.getTime(),
            userName: $name.text(),
            message: $chatInput.val()
          };
          receiverData = {
            name: $chatPerson.text(),
            gravatar: $gravatar.attr('src')
          };
          data.receiverData = receiverData;
          $chatInput.val('');
          return self.sendMessage(data);
        }
      });
    };


    /*
    		* send message
    		* @param {Object} messageData: the detail of message,including receiver user data and message detail
     */

    MessageSend.prototype.sendMessage = function(messageData) {
      var isPrivate;
      isPrivate = Status.isPrivateChat();
      if (isPrivate) {
        return socket.emit('private chat', messageData);
      } else {
        socket.emit('new message', messageData);
        return $.ajax({
          type: "POST",
          url: '/addChat',
          data: messageData,
          success: function(data) {}
        });
      }
    };

    MessageSend.prototype.successSendMessage = function() {
      var self;
      self = this;
      return socket.on('send message', function(messageData) {
        return Receiver.showMessage(messageData);
      });
    };

    return MessageSend;

  })();
  module.exports = MessageSend;
}



},{"./helper.coffee":4,"./maintain-chating.coffee":7,"./message-receive.coffee":8}],10:[function(require,module,exports){
var $chatingUser, UserDom;

$chatingUser = $('#chating-user');

UserDom = {
  markChatingNowUser: function(index) {
    $chatingUser.find('img').removeClass('chat-now');
    return $chatingUser.find('img').eq(index).addClass('chat-now');
  },
  getUserIndex: function(name) {
    var currentIndex;
    currentIndex = 0;
    $chatingUser.find('span.chat-user-name').each(function(index) {
      var userName;
      userName = $(this).text();
      if (userName === name) {
        currentIndex = index;
      }
    });
    return currentIndex;
  }
};

module.exports = UserDom;



},{}]},{},[6]);
