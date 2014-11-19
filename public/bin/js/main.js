(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $name, Socket, chat, socket, userList;

chat = require('./chat.coffee');

$name = $("#my-name").text();

userList = $('.user-list');

socket = io();

Socket = (function() {
  function Socket() {}

  Socket.prototype.init = function() {
    socket.emit("join");
    socket.on('new user', function(data) {
      return console.log(data);
    });
    socket.on('user left', function(data) {
      return console.log(data);
    });
    return socket.on('login', function(data) {
      return console.log(data);
    });
  };

  return Socket;

})();

module.exports = Socket;



},{"./chat.coffee":2}],2:[function(require,module,exports){
var Chat;

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

Chat = (function() {
  function Chat() {}

  Chat.prototype.showMessage = function(node, data) {
    var $chatList;
    $chatList = $('<li class="a-chat">test</li>');
    return node.append($chatList);
  };

  Chat.prototype.getTime = function() {
    var time;
    return time = new Date().Format("yyyy-MM-dd hh:mm:ss");
  };

  return Chat;

})();

module.exports = Chat;



},{}],3:[function(require,module,exports){
var Socket, chat, socket;

chat = require("./chat.coffee");

Socket = require("./Socket.coffee");

socket = new Socket();

socket.init();



},{"./Socket.coffee":1,"./chat.coffee":2}]},{},[3]);
