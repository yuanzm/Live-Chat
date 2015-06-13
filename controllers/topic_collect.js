// 引入所需模块
var eventproxy     = require('eventproxy');
var validator = require('validator');
var Topic = require('../proxy').Topic;
var User = require('../proxy').User;
var TopicCollect = require('../proxy').TopicCollect;

/*
 * 收藏一个帖子
 * - 保存一条收藏到数据库
 * - 更新帖子的被收藏数
 * - 帖子的作者的被收藏数加1
 * - 帖子作者积分加5
 */
exports.collect = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var user_id = req.session.user._id;
	var tid = req.params.tid;

	ep.on('collect_err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			errMessage: errMessage
		}
		res.json(data);
	});

	if (tid.length !== 24) {
		return ep.emit('collect_err', 410, '帖子不存在');
	}

	Topic.getTopicById(tid, function(err, topic, author) {
		var proxy = new eventproxy();
		proxy.all('update_topic', 'new_collect', 'update_user', 'update_author', function() {
			res.status(200);
			data = {
				errCode: 200,
				message: '收藏成功'
			}
			req.session.user.collect_topic_count += 1;
			res.json(data);
		});
		TopicCollect.getCollectByUserId(user_id, tid, function(err, topiccollect) {

			if (topiccollect) {
				return ep.emit('collect_err', 403, '不能重复收藏');
			}
		});

		if (err) {
			return ep.emit('collect_err', 500, '内部错误');
		}
		if (!topic) {
			return ep.emit('collect_err', 410, '帖子不存在');
		}

		TopicCollect.newAndSave(user_id, tid, proxy.done('new_collect'))

		topic.collect_count += 1;
		topic.save(proxy.done('update_topic'));

		author.be_collect_topic_count += 1;
		author.score += 5;
		author.save(proxy.done('update_author'));

		User.getUserById(user_id, function(err, user) {
			user.collect_topic_count += 1;
			user.save(proxy.done('update_user'));
		});

	});
}

/*
 * 取消收藏一个帖子
 * - 要保证帖子是存在的
 * - 要保证之前已经收藏了
 * - 话题作者的积分减5
 * - 话题作者的被收藏数减1
 * - 操作者的收藏数减1
 */
exports.de_collect = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var user_id = req.session.user._id;
	var tid = req.params.tid;

	ep.on('de_collect_err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			errMessage: errMessage
		}
		res.json(data);
	});

	if (tid.length != 24) {
		return ep.emit('de_collect_err', 410, '帖子不存在');
	}

	Topic.getTopicById(tid, function(err, topic, author) {
		var proxy = new eventproxy();
		proxy.all('update_topic', 'delete_collect', 'update_author', 'update_user', function() {
			res.status(200);
			data = {
				errCode: 200,
				message: '取消收藏成功'
			}
			req.session.user.collect_topic_count -= 1;
			res.json(data);
		})
		if (err) {
			return ep.emit('de_collect_err', 500, '内部错误');
		}
		if (!topic) {
			return ep.emit('de_collect_err', 410, '帖子不存在');
		}

		TopicCollect.getCollectByUserId(user_id, tid, function(err, topiccollect) {
			if (!topiccollect) {
				return ep.emit('de_collect_err', 410, '未收藏不能取消');
			}
			TopicCollect.remove(user_id, tid, proxy.done('delete_collect'));
		});

		topic.collect_count -= 1;
		topic.save(proxy.done('update_topic'));

		author.be_collect_topic_count -= 1;
		author.score -= 5;
		author.save(proxy.done('update_author'));

		User.getUserById(user_id, function(err, user) {
			user.collect_topic_count -= 1;
			user.save(proxy.done('update_user'));
		});
	});
}
