// 引入所需模块
var eventproxy     = require('eventproxy');
var validator = require('validator');
var Topic = require('../proxy').Topic;
var User = require('../proxy').User;

exports.showCreate = function(req, res) {

};

/*
 * 新建一条话题
 * - 保存一条话题到数据库
 * - 用户的分数加5
 * - 用户的话题数量加1
 */
exports.create = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var title = validator.trim(req.body.title);
	title = validator.escape(title);
	var content = validator.trim(req.body.content);
	content = validator.escape(content);
	var author_id = req.session.user._id;

	ep.on('create_err', function(errMessage) {
		res.status(422);
		data = {
			errCode: 422,
			message: errMessage
		}
		res.json(data);
	});

	if ([title, content].some(function(item) {return item === ''})) {
		return ep.emit('create_err', "内容或标题不能为空");
	}

	Topic.newAndSave(title, content, author_id, function(err, topic) {
		if (err) {
			return next(err);
		}
		User.getUserById(author_id, function(err, user) {
			if (err) {
				return next(err);
			}
			user.topic_count += 1;
			user.score += 5;
			user.save(function(err) {
				if (err) {
					return next(err);
				}
				res.status(200);
				data = {
					errCode: 200,
					message: '发表成功'
				}
				req.session.user = user;
				res.json(data);
			})
		});
	})

};

/*
 * 更新一篇帖子
 * - 只有存在的帖子才能更新
 * - 只有用户本身或者管理员才有权限更新帖子
 * - 修改帖子的最后更新时间
 */

exports.update = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var title = validator.trim(req.body.title);
	title = validator.escape(title);
	var content = validator.trim(req.body.content);
	content = validator.escape(content);
	var user_id = req.session.user._id;
	var tid = req.params.tid;

	ep.on('update_err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			message: errMessage
		}
		res.json(data);
	});

	if(!title.length || !content.length) {
		return ep.emit('update_err', 422, '标题或者内容不能为空');
	}

	if (tid.length != 24) {
		return ep.emit('update_err', 410, '帖子不存在或者已经删除');
	}

	Topic.getTopicById(tid, function(err, topic, author) {
		if (!topic) {
			return ep.emit('update_err', 410, '帖子不存在或者已经删除');
		}

		if (!(topic.author_id.equals(user_id)) && !req.session.user.is_admin) {
			return ep.emit('update_err', 403, '没有权限');
		}

		topic.title = title;
		topic.content = content;
		topic.update_at = new Date();

		topic.save(function(err) {
			if (err) {
				return ep.emit('update_err', 500, '内部错误');
			}
			res.status(200);
			data = {
				errCode: 200,
				message: '更新成功'
			}
			res.json(data);
		})
	})
}

exports.index = function(req, res, next) {

};

exports.showEdit = function(req, res, next) {

};

/*
 * 删除一条话题
 * - 只有用户本身才能删除帖子
 * - 帖子的删除属性设置为真
 * - 用户的帖子数量减1
 */
exports.deleteTopic = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var tid = validator.trim(req.params.tid);
	var user_id = req.session.user._id;

	ep.on('delete-err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			message: errMessage
		};

		res.json(data);
	}) 

	if (tid.length != 24) {
		return ep.emit('delete-err', 410, '帖子不存在或者已经删除');
	}

	Topic.getTopicById(tid, function(err, topic, author) {
		var proxy = new eventproxy();
		if (!topic) {
			return ep.emit('delete-err', 410, '帖子不存在或者已经删除');
		}

		if (!(topic.author_id.equals(user_id)) && !req.session.user.is_admin) {
			return ep.emit('delete-err', 403, '没有权限删除该帖子');
		}

		proxy.all('update-user', 'update-topic', function() {
			res.status(200);
			data = {
				errCode: 200,
				message: '删除成功'
			}
			res.json(data);
		})
		topic.deleted = true;
		topic.save(proxy.done('update-topic'));

		author.topic_count -= 1;
		author.save(proxy.done('update-user'));
	});
};

/*
 * 为某一个话题点赞
 * - 查询某个用户是否在点在列表里面，如果在，删除该用户，如果不在，添加该用户
 */
exports.up = function(req, res, next) {
	var uper_id = req.session.user._id;
	var cid = req.params.tid;

	var ep = new eventproxy();
	ep.fail(next);

	ep.on('up-err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			message: errMessage
		}
		res.json(data);
	})
	Topic.getTopicById(cid, function(err, topic, author) {
		if (err) {

		}
		// 状态码410表示消失了
		if (!topic) {
			return ep.emit('up-err', 410, '该话题不存在');
		}
		var index = topic.ups.indexOf(uper_id);

		if (index > -1) {
			topic.ups.slice(index, 1);
		} else {
			topic.ups.push(uper_id);
		}
		// 501: 无法满足这个要求
		topic.save(function(err, topic) {
			if (err) {
				return ep.emit('up-err', 501, '数据库错误');
			}
			res.status(200);
			data = {
				errCode: 200,
				message: '点赞操作成功',
				total: topic.ups.length
			}
			res.json(data);
		});
	})
}
