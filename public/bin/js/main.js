(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
* Web App's name and logo
 */
var LiveChat;

LiveChat = {
  name: 'Live-Chat',
  gravatar: 'https://avatars3.githubusercontent.com/u/6168796?v=3&s=48'
};

module.exports = LiveChat;



},{}],2:[function(require,module,exports){

/*
* A module to process the chat user list
 */
var $chatLeft, $chatPerson, $chatingUser, $chatsList, $gravatar, $liveUser, $name, LiveChat, LiveUser, LoadChats, Status, UserDom, chatingUser;

if (location.pathname === "/") {
  $chatingUser = $('#chating-user');
  $chatPerson = $('#chat-person');
  $chatLeft = $('#chat-left');
  $name = $("#my-name");
  $liveUser = $('#live-user');
  $chatsList = $('#chat-list');
  $gravatar = $('#gravatar');
  Status = require('./maintain-chating.coffee');
  LiveUser = require('./live-user.coffee');
  UserDom = require('./user-dom.coffee');
  LiveChat = require('./LiveChat-config.coffee');
  LoadChats = require('./chats.coffee');
  LoadChats.loadMore();

  /*
  	* event handlers be bound to chatting users
   */
  chatingUser = {

    /*
    		* Bind event handlers to users in chatting list by calling some functions
     */
    init: function() {
      this.clickToDeletePerson();
      this.changeChatingPerson();
      this.removeChatPerson();
      return this.getChatList();
    },

    /*
    		* When login successful or refresh the page,load some datas we need.
    		* Firstly, we need to load the chat user list.
    		* If there users in the list we loaded just now,
    		* show the chat list on the page by adding class `is-chating` to the chatting room.
    		* Also, we need to add the users to array `userCollection` which maintain these users' status.
    		* Secondly, we also need to get the chatting user,if he exists, mark it in the chat user list.
    		* Besides, it is essential to rename the chatting user.
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
          for (_i = 0, _len = isChating.length; _i < _len; _i++) {
            user = isChating[_i];
            LiveUser.addChatPerson(user);
            LiveUser.userCollection[user.name] = new LiveUser.OneUser(user.name);
          }
          LiveUser.userCollection[LiveChat.name] = new LiveUser.OneUser(LiveChat.name);
          if (chatNow.length) {
            index = UserDom.getUserIndex(chatNow);
            UserDom.markChatingNowUser(index);
            self.nameChattingPerson(chatNow);
            if (chatNow === LiveChat.name) {
              return LoadChats.loadGroupChat(true);
            } else {
              return LoadChats.loadPrivateChat(chatNow, true);
            }
          }
        }
      });
    },

    /*
    		* Click the `close button` to the top right corner of the user's avatar to 
    		* remove one user from the chat user list.
     */
    clickToDeletePerson: function() {
      var self;
      self = this;
      return $chatingUser.delegate('.close-chating', 'click', function(event) {
        var chatingNum, name;
        name = $(this).parent().text();
        self.removeChatPerson(name);
        Status.removeUserFromChatList($name.text(), name, function(data) {});
        chatingNum = LiveUser.checkChatingNum();
        if (chatingNum === 0) {
          self.nameChattingPerson('Live-Chat');
          $chatLeft.removeClass('is-chating');
          Status.updateChatingNowPerson($name.text(), LiveChat.name, function(data) {});
        }
        return event.stopPropagation();
      });
    },
    getSelfGravatar: function() {
      return $gravatar.attr('src');
    },

    /*
    		* There are several things need to be executed when click a user in the chat user list
    		* Firstly, reset the chatting user at the database level through Ajax.
    		* Secondly, rename the chatting user on the page.
    		* Thirdly, we need to mark the user we click just now.
    		* Fourthly, query the last 20 chats through Ajax.
    		* Lastly, repaint the chat room.
     */
    changeChatingPerson: function() {
      var self;
      self = this;
      return $chatingUser.delegate('li', 'click', function() {
        var chatNow, gravatar, index, name, status;
        name = $(this).find('.chat-user-name').text();
        gravatar = $(this).find('img').attr('src');
        chatNow = self.getChattingPerson();
        if (chatNow !== name) {
          Status.updateChatingNowPerson($name.text(), name, function(data) {});
          self.nameChattingPerson(name);
          index = UserDom.getUserIndex(name);
          UserDom.markChatingNowUser(index);
          status = self.getChatStatus(name);
          if (name === LiveChat.name) {
            LoadChats.loadGroupChat(true);
          } else {
            LoadChats.loadPrivateChat(name, true);
          }
          UserDom.removeNotice($chatingUser, name);
          LiveUser.userCollection[name].setNoRead(0);
          return $('#chat-room').mCustomScrollbar('scrollTo', "bottom");
        }
      });
    },
    getChatStatus: function(name) {
      var chatName, status;
      chatName = LiveUser.userCollection[name];
      return status = {
        start: chatName.getChatStart(),
        limit: chatName.getChatLimit()
      };
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
    		* display the chating user
     */
    nameChattingPerson: function(name) {
      return $chatPerson.text(name);
    },

    /*
    		* Get chatting user
     */
    getChattingPerson: function() {
      return $chatPerson.text();
    }
  };
  module.exports = {
    chatingUser: chatingUser
  };
}



},{"./LiveChat-config.coffee":1,"./chats.coffee":3,"./live-user.coffee":6,"./maintain-chating.coffee":8,"./user-dom.coffee":12}],3:[function(require,module,exports){
var $chatsList, $chattingUser, $gravatar, $loadMore, $name, LiveChat, LiveUser, Status, UserDom, getChatStatus, loadChats, processData, repaintChatRoom, updateChatStatus;

LiveUser = require('./live-user.coffee');

Status = require('./maintain-chating.coffee');

UserDom = require('./user-dom.coffee');

LiveChat = require('./LiveChat-config.coffee');

$chattingUser = $('#chating-user');

$gravatar = $('#gravatar');

$name = $("#my-name");

$chatsList = $('#chat-list');

$loadMore = $('.load-more');


/*
* When load chats from database,we need to package it to insert into the front-end templates
* @param {Array} messageData: an array of chats
* @param {gravatar} gravatar:
 */

processData = function(messageData) {
  var allmessage, chat, chatPackage, gravatar, myGravatar, _i, _len;
  myGravatar = UserDom.getSelfGravatar();
  gravatar = UserDom.getChattingGravatar();
  allmessage = [];
  for (_i = 0, _len = messageData.length; _i < _len; _i++) {
    chat = messageData[_i];
    gravatar = chat.speaker === $name.text() ? myGravatar : gravatar;
    chatPackage = {
      receiverData: {
        gravatar: gravatar
      },
      userName: chat.speaker,
      message: chat.message
    };
    allmessage.push(chatPackage);
  }
  return allmessage;
};


/*
* Before loading more chats, we need to know the status of chats in chat room
* @param {String} name: the name of user
 */

getChatStatus = function(name) {
  var chatName, status;
  console.log(name);
  chatName = LiveUser.userCollection[name];
  return status = {
    start: chatName.getChatStart(),
    limit: chatName.getChatLimit()
  };
};

updateChatStatus = function(name, chatLength) {
  var $isChatting, chatName, oldStart;
  $isChatting = $chattingUser.find('.chat-user-name');
  $isChatting.each(function() {
    var thisname;
    thisname = $(this).text();
    if (thisname !== name) {
      return LiveUser.userCollection[thisname].setChatStart(0);
    }
  });
  chatName = LiveUser.userCollection[name];
  oldStart = chatName.getChatStart();
  return chatName.setChatStart(oldStart + chatLength);
};


/*
* Repaint the chat room
* @param {Array} allmessage: an array contain messages need to be repainted.
 */

repaintChatRoom = function(allMessage, needEmpty) {
  var message, _i, _len;
  $('.load-more').remove();
  if (needEmpty) {
    $chatsList.empty();
  }
  for (_i = 0, _len = allMessage.length; _i < _len; _i++) {
    message = allMessage[_i];
    UserDom.showMessage(message, true);
  }
  return $chatsList.prepend($('<a class="load-more">Load more</a>'));
};

loadChats = {

  /*
  	* Load history chats from database.
   */
  loadPrivateChat: function(name, needEmpty) {
    var limit, self, start, status;
    status = getChatStatus(name);
    start = status.start;
    limit = status.limit;
    self = this;
    return Status.getTwenty($name.text(), name, start, start + limit, function(data) {
      var allmessage, chatLength;
      if (data) {
        allmessage = processData(data);
        repaintChatRoom(allmessage, needEmpty);
        if (needEmpty) {
          console.log('ciao');
          $('#chat-room').mCustomScrollbar('scrollTo', "bottom");
        }
        chatLength = allmessage.length;
        return updateChatStatus(name, chatLength);
      }
    });
  },
  loadGroupChat: function(needEmpty) {
    var self, start, status;
    self = this;
    status = getChatStatus(LiveChat.name);
    start = status.start;
    return Status.getGroupTwenty(start, function(data) {
      if (data) {
        repaintChatRoom(data, needEmpty);
        updateChatStatus(LiveChat.name, data.length);
      }
      if (needEmpty) {
        return $('#chat-room').mCustomScrollbar('scrollTo', "bottom");
      }
    });
  },
  loadMore: function() {
    var self;
    self = this;
    return $chatsList.delegate('.load-more', 'click', function() {
      var chatNow, gravatar;
      chatNow = UserDom.getChattingNow();
      if (chatNow === LiveChat.name) {
        self.loadGroupChat(false);
      } else {
        gravatar = UserDom.getChattingGravatar(chatNow);
        self.loadPrivateChat(chatNow, false);
      }
      return false;
    });
  }
};

module.exports = loadChats;



},{"./LiveChat-config.coffee":1,"./live-user.coffee":6,"./maintain-chating.coffee":8,"./user-dom.coffee":12}],4:[function(require,module,exports){
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



},{"./helper.coffee":5,"./live-user.coffee":6}],5:[function(require,module,exports){

/*
* A module containing the auxiliary function
 */

/*
* A function extends the Date's prototype
* @param {String} fmt: a string format date
* @return {String} fmt: a string of date
 */
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



},{}],6:[function(require,module,exports){
var $chatLeft, $chatPerson, $chatingUser, $liveNumber, $liveUser, $myName, $name, $window, LiveChat, OneUser, Status, UserDom, liveUser, offlineList;

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
  offlineList = require("./offlinelist.coffee");

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
      $chatingUser.find('ul').append($(chatDiv));
      return UserDom.emptyChatRoom();
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
      var num, self;
      self = this;
      num = $chatingUser.find('img').length;
      if (self.detectIsChatting(LiveChat.name)) {
        num -= 1;
      }
      return num;
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
      var self, user, userData;
      self = this;
      $liveUser.empty();
      for (user in allUser) {
        userData = allUser[user];
        self.showNewUser(userData);
      }
      return offlineList.markOffLineUsers();
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
        this.noRead = 0;
      }

      OneUser.prototype.getChatStart = function() {
        return this.chatStart;
      };

      OneUser.prototype.setChatStart = function(newStart) {
        return this.chatStart = newStart;
      };

      OneUser.prototype.getNoRead = function() {
        return this.noRead;
      };

      OneUser.prototype.setNoRead = function(newNoRead) {
        return this.noRead = newNoRead;
      };

      OneUser.prototype.getChatLimit = function() {
        return this.chatLimit;
      };

      return OneUser;

    })(),
    userCollection: [],
    showCollection: function(self) {},
    getUserIndex: function(name) {
      var currentIndex;
      currentIndex = 0;
      $liveUser.find('span.chat-user-name').each(function(index) {
        var userName;
        userName = $(this).text();
        if (userName === name) {
          currentIndex = index;
        }
      });
      return currentIndex;
    }
  };
  module.exports = liveUser;
}



},{"./LiveChat-config.coffee":1,"./maintain-chating.coffee":8,"./offlinelist.coffee":11,"./user-dom.coffee":12}],7:[function(require,module,exports){
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

$('#chat-room').mCustomScrollbar({
  theme: "minimal-dark",
  scrollButtons: {
    enable: false,
    scrollType: "continuous",
    scrollSpeed: 500,
    scrollAmount: 40
  }
});



},{"./chating-user.coffee":2,"./connect-status.coffee":4,"./live-user.coffee":6,"./message-send.coffee":10}],8:[function(require,module,exports){

/*
* A module to process the Ajax request
 */
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

  /*
  * To check whether a user have chatted with before through Ajax
  * @param {String} myname: self name
  * @param {String} name: the user's name to be checked
  * @param {Function} callback: a function which be will fire after the checking
   */
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

  /*
  * To insert a user's name into the database through Ajax
  * @param {String} myname: self name
  * @param {String} name: the user's name to be inserted
  * @param {Function} callback: a function which will be fire after the insertion
   */
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

  /*
  * Get 20 chats with a specific user
  * @param {String} myname: self name
  * @param {String} name: the user's name
  * @param {Number} start: the starting point of the query
  * @param {end} end: the ending point of the query
  * @param {Function} callback: a function which will be fire after the query
   */
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
  },

  /*
  * Get 20 group chats
  * @param {Number} start: if there are group chats on the page and we need to 
  * load more chats, it is necessary to skip the existing chats.
  * @param {Function} callback: a function which will fire after the query.
   */
  getGroupTwenty: function(start, callback) {
    var url;
    url = '/chat/group-chat/' + start;
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



},{}],9:[function(require,module,exports){
var $chatList, $chatPerson, $chatingUser, $liveUser, $name, LiveChat, LiveUser, MessageReceive, UserDom, socket;

if (location.pathname === "/") {
  $chatList = $('#chat-list');
  LiveUser = require('./live-user.coffee');
  socket = io();
  $name = $("#my-name");
  $chatPerson = $('#chat-person');
  $chatingUser = $('#chating-user');
  $liveUser = $('#live-user');
  UserDom = require('./user-dom.coffee');
  LiveChat = require('./LiveChat-config.coffee');
  MessageReceive = {

    /*
    		* Bind event handlers for socket
     */
    init: function() {
      this.detectPrivateMessage();
      return this.detectMessage();
    },

    /*
    		* If someone send a group chat message, display it in the chat room
     */
    detectMessage: function() {
      var self;
      self = this;
      return socket.on('message', function(messageData) {
        var chatNow;
        chatNow = UserDom.getChattingNow();
        if (chatNow !== LiveChat.name) {
          return self.addNotice(LiveChat.name);
        } else {
          return UserDom.showMessage(messageData);
        }
      });
    },

    /*
    		* display the unread messages number on user's gravatar
    		* @param {Number} index: the position of the user in the chat list
    		* @param {Number} num: the number of unread messages
     */
    displayNotice: function(name, displayArea, num) {
      var aNotice, index;
      index = UserDom.getUserIndex(name);
      console.log(index);
      aNotice = '<div class="notice">';
      aNotice += '<span class="notice-number">' + num + '</span>';
      aNotice += '</div>';
      return displayArea.find('li').eq(index).append($(aNotice));
    },
    addNotice: function(name) {
      var index;
      LiveUser.userCollection[name].noRead += 1;
      index = UserDom.getUserIndex(name);
      return this.displayNotice(name, $chatingUser, LiveUser.userCollection[name].noRead);
    },

    /*
    		* If receive a private message,
     */
    detectPrivateMessage: function() {
      var self;
      self = this;
      return socket.on('private message', function(data) {
        var fromName, index;
        fromName = data.userName;
        if (LiveUser.detectIsChatting(fromName)) {
          if ($chatPerson.text() === fromName) {
            return UserDom.showMessage(data);
          } else {
            LiveUser.userCollection[fromName].noRead += 1;
            index = UserDom.getUserIndex(fromName);
            return self.displayNotice(fromName, $chatingUser, LiveUser.userCollection[fromName].noRead);
          }
        } else {
          return self.displayNotice(fromName, $liveUser, 1);
        }
      });
    }
  };
  module.exports = MessageReceive;
}



},{"./LiveChat-config.coffee":1,"./live-user.coffee":6,"./user-dom.coffee":12}],10:[function(require,module,exports){
var $chatInput, $chatPerson, $gravatar, $name, $window, MessageSend, Receiver, Status, UserDom, helper, socket;

if (location.pathname === "/") {
  Receiver = require("./message-receive.coffee");
  helper = require("./helper.coffee");
  Status = require("./maintain-chating.coffee");
  UserDom = require('./user-dom.coffee');
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
      this.successSendMessage();
      return this.successSendPrivateMessage();
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
          if ($chatInput.val() !== '') {

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
        return UserDom.showMessage(messageData);
      });
    };

    MessageSend.prototype.successSendPrivateMessage = function() {
      var self;
      self = this;
      return socket.on('send private message', function(messageData) {
        return UserDom.showMessage(messageData);
      });
    };

    return MessageSend;

  })();
  module.exports = MessageSend;
}



},{"./helper.coffee":5,"./maintain-chating.coffee":8,"./message-receive.coffee":9,"./user-dom.coffee":12}],11:[function(require,module,exports){

/*
* A module to process the offline user list
 */
var $chatList, $liveUser, offLine,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

$chatList = $('#chating-user');

$liveUser = $('#live-user');

offLine = {
  offLineList: [],
  markOffLineUsers: function() {
    var $chatLists, $liveUsers, chat, chatArray, liveArray, _i, _len, _results;
    $chatLists = $chatList.find('span');
    $liveUsers = $liveUser.find('span');
    chatArray = [];
    liveArray = [];
    $chatLists.each(function() {
      if (($(this).text() !== '') && ($(this).text() !== 'Live-Chat')) {
        return chatArray.push($(this).text());
      }
    });
    $liveUsers.each(function() {
      return liveArray.push($(this).text());
    });
    _results = [];
    for (_i = 0, _len = chatArray.length; _i < _len; _i++) {
      chat = chatArray[_i];
      if (this.offLineList[chat]) {
        this.opaqueUser(chat);
        delete this.offLineList[chat];
      }
      if (!(__indexOf.call(liveArray, chat) >= 0)) {
        this.offLineList[chat] = chat;
        _results.push(this.translucentUser(chat));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  },
  translucentUser: function(name) {
    var $chatLists;
    $chatLists = $chatList.find('li');
    return $chatLists.each(function() {
      if ($(this).find('.chat-user-name').text() === name) {
        return $(this).css('opacity', '0.5');
      }
    });
  },
  opaqueUser: function(name) {
    var $chatLists;
    $chatLists = $chatList.find('li');
    return $chatLists.each(function() {
      if ($(this).find('.chat-user-name').text() === name) {
        return $(this).css('opacity', '1');
      }
    });
  }
};

module.exports = offLine;



},{}],12:[function(require,module,exports){
var $chatList, $chatNow, $chatRoom, $chatingUser, $gravatar, UserDom;

$chatingUser = $('#chating-user');

$chatList = $('#chat-list');

$gravatar = $('#gravatar');

$chatNow = $('#chat-person');

$chatRoom = $('#chat-room');

UserDom = {
  markChatingNowUser: function(index) {
    $chatingUser.find('img').removeClass('chat-now');
    return $chatingUser.find('img').eq(index).addClass('chat-now');
  },
  getChattingGravatar: function() {
    var index, name;
    name = $chatNow.text();
    index = this.getUserIndex(name);
    return $chatingUser.find('img').eq(index).attr('src');
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
  },
  removeNotice: function(displayArea, name) {
    var index;
    index = UserDom.getUserIndex(name);
    return displayArea.find('li').eq(index).find('.notice').remove();
  },
  showMessage: function(data, isprepend) {
    var aChat;
    aChat = '<li>';
    aChat += '<img class="gravatar" src="' + data.receiverData.gravatar + '">';
    aChat += '<span>' + data.userName + '</span>';
    aChat += '<br />';
    aChat += '<span>' + data.message + '</span>';
    aChat += '</li>';
    if (isprepend) {
      return $chatList.prepend($(aChat));
    } else {
      return $chatList.append($(aChat));
    }
  },
  getSelfGravatar: function() {
    return $gravatar.attr('src');
  },
  getChattingNow: function() {
    return $chatNow.text();
  },
  scrollToBottom: function() {
    return $chatRoom.scrollTop($chatRoom[0].scrollHeight);
  },
  emptyChatRoom: function() {
    return $chatList.empty();
  }
};

module.exports = UserDom;



},{}]},{},[7]);
