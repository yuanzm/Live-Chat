(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Unread, unread;

Unread = (function() {
  function Unread(number) {
    this.number = number;
  }

  Unread.prototype.getUnread = function() {
    return this.number;
  };

  Unread.prototype.addOneUnread = function() {
    return this.number += 1;
  };

  Unread.prototype.removeNumber = function(value) {
    return this.number -= value;
  };

  Unread.prototype.setUnread = function(newNumber) {
    return this.number = newNumber;
  };

  return Unread;

})();

unread = new Unread(0);

module.exports = unread;


},{}]},{},[1]);