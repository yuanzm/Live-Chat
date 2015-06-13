(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){



},{}],2:[function(require,module,exports){
$(function() {
  var index, nav, pathname, target;
  pathname = document.location.pathname;
  target = pathname.split("/")[1];
  console.log(target);
  if (target === "" || target === "test") {
    index = 0;
  } else if (target === "signup") {
    index = 2;
  } else if (target === "signin") {
    index = 1;
  }
  if (index !== void 0) {
    nav = $("#header").find(".nav").find("li").removeClass("active");
    $(nav[index]).addClass("active");
  }
  return $('#logout').on('click', function() {
    return $.ajax({
      type: 'post',
      url: '/signout'
    });
  });
});


},{}]},{},[1,2]);