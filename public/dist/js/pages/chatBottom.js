(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $chatBottomBar, $chatBox, ChatBottom, chatBottom;

$chatBottomBar = $('.chat-bottpm-bar');

$chatBox = $('#chat-box');

ChatBottom = (function() {
  function ChatBottom(number) {
    this.number = number;
  }

  ChatBottom.prototype.clickBottomHandler = function() {
    $(this).hide();
    $chatBox.show();
    return $('.chat-contact').last().click();
  };

  ChatBottom.prototype.closeChatBottom = function() {
    $chatBox.hide();
    return $chatBottomBar.show();
  };

  ChatBottom.prototype.setChatBottomNumber = function(messageNumber) {
    var number;
    number = messageNumber > 0 ? '(' + messageNumber + ')' : '';
    return $chatBottomBar.find('.message-number').text(number);
  };

  ChatBottom.prototype.loadChatBottomBar = function() {
    $chatBottomBar.show();
    return this.setChatBottomNumber(this.getUnread());
  };

  ChatBottom.prototype.getUnread = function() {
    return this.number;
  };

  ChatBottom.prototype.addOneUnread = function() {
    this.number += 1;
    return this.setChatBottomNumber(this.getUnread());
  };

  ChatBottom.prototype.removeNumber = function(value) {
    this.number -= value;
    return this.setChatBottomNumber(this.getUnread());
  };

  ChatBottom.prototype.setUnread = function(newNumber) {
    return this.number = newNumber;
  };

  return ChatBottom;

})();

chatBottom = new ChatBottom(0);

module.exports = chatBottom;


},{}]},{},[1]);