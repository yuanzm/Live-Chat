(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){




},{}],2:[function(require,module,exports){
var Chat;

Chat = (function() {
  function Chat() {}

  return Chat;

})();



},{}],3:[function(require,module,exports){
var chat, chatCLient, name, socket, userList;

chat = require("./chat.coffee");

chatCLient = require("./chat-client.coffee");

socket = io();

name = $("#my-name").text();

socket.emit("join");

userList = $('.user-list');

socket.on('new user', function(data) {
  return userList.empty().append('<span>' + data.userNumbers + '</span>');
});

socket.on('user left', function(data) {
  return userList.empty().append('<span>' + data.userNumbers + '</span>');
});

socket.on('login', function(data) {
  return userList.empty().append('<span>' + data.userNumbers + '</span>');
});



},{"./chat-client.coffee":1,"./chat.coffee":2}]},{},[3]);
