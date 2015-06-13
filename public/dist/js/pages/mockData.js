(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var chatList, msgs;

chatList = {
  who: '1',
  dowhat: 'get_chat_list',
  msg: {
    total_new_msg_count: '3',
    contacts: [
      {
        username: 'cyrilzhao',
        id: "3",
        new_msg_count: 3,
        online: 1,
        className: '',
        avatar: 'http://7sbxao.com1.z0.glb.clouddn.com/login.jpg'
      }
    ]
  }
};

msgs = [
  {
    'sender': '4',
    content: "hello"
  }, {
    'sender': '1',
    content: "hello world"
  }
];

module.exports = {
  chatList: chatList,
  msgs: msgs
};


},{}]},{},[1]);