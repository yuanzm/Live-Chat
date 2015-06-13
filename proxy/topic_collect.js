var models = require('../models');
var TopicCollect = models.TopicCollect;
var UserProxy = require('./user.js');
var TopicProxy = require('./topic.js');
var eventproxy = require('eventproxy');

/*
 * 新建一条收藏
 * @param {ObjectId} user_id: 收藏者的id
 * @param {ObjectId} topic_id: 话题的id
 */
exports.newAndSave = function(user_id, topic_id, callback) {
	var topiccollect = new TopicCollect();
	topiccollect.user_id = user_id;
	topiccollect.topic_id = topic_id;
	
	topiccollect.save(callback);	
}

/*
 * 从数据库中删除一条收藏
 */
exports.remove = function(user_id, topic_id, callback) {
	TopicCollect.remove({'user_id': user_id, 'topic_id': topic_id}, callback);
}

/*
 * 根据用户id和话题id来查找一条收藏
 */
exports.getCollectByUserId = function(user_id, topic_id, callback) {
	TopicCollect.findOne({'user_id': user_id, 'topic_id': topic_id}, callback);
}

/*
 * 根据查询条件查询收藏对应的话题
 * @param {Object} query: 查询条件
 * @param {Object} opt: 查询限制
 * callback
 *	- topics: 根据查询条件查询到的一组话题
 */
exports.getCollectTopicByQuery = function(query, opt, callback) {
	TopicCollect.find(query, {}, opt, function(err, collects) {
		if (err) {
			callback(err);
		}
		if (!collects) {
			callback(null, null);
		}
		var ep = new eventproxy();
		ep.fail(callback)
		var topics = [];
		var length = collects.length;

		ep.after('one-topic-push-done', length, function() {
			callback(null, topics);
		})

		ep.on('one-topic', function(topic, author) {
			var oneTopic = {
				topic: topic,
				author: author
			}
			topics.push(oneTopic);
			ep.emit('one-topic-push-done')
		})

		for(var i = 0;i < length;i++) {
			TopicProxy.getTopicById(collects[i].topic_id, ep.done('one-topic'))
		}
	});
}
