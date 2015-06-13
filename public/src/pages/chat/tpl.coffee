_ = require('lodash');

oneChatterTemplate = require('./tpl/one-chatter.tpl')
oneChatterCompile = _.template oneChatterTemplate

# 页面模板
oneMessageTemplate = require('./tpl/one-message.tpl')
oneMessageCompile = _.template oneMessageTemplate

oneLiveTemplate = require('./tpl/one-live-user.tpl')
oneLiveCompile = _.template oneLiveTemplate

module.exports =
	oneChatterCompile: oneChatterCompile
	oneMessageCompile: oneMessageCompile
	oneLiveCompile: oneLiveCompile
	