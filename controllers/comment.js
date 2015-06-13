var eventproxy     = require('eventproxy');
var validator = require('validator');
var Topic = require('../proxy').Topic;
var User = require('../proxy').User;
var Comment = require('../proxy').Comment;

/*
 * 新增一条评论
 * 	- 保存该评论到数据库
 *	- 话题的评论数加1
 *	- 话题作者的评论数加1，分数加5
 */
exports.add = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var content = validator.trim(req.body.content);
	content = validator.escape(content);
	var topic_id = req.params.tid;
	author_id = req.session.user._id;
	// 如果是评论的评论，就能用上
	comment_id = req.body.comment_id;

	ep.on('empty-message', function(errMessage) {
		res.status(422);
		data = {
			errCode: 422,
			message: errMessage
		}
		res.json(data);
	})
	if (!content.length) {
		return ep.emit('empty-message', '评论内容不能为空')
	}
	// 数据库中新增一条评论
	Comment.newAndSave(content, topic_id, author_id, comment_id, function(err, comment) {
		if (err) {
			return next();
		}

		var proxy = new eventproxy();
		proxy.all('update-topic', 'update-user', function(topic) {
			res.status(200);
			data = {
				errCode: 200,
				message: '评论成功',
			}
			res.json(data);
		})
		Topic.getTopicById(topic_id, function(err, topic, author) {
			topic.comment_count += 1;
			topic.save(function(err, topic) {
				if (err) {
					return next()
				}
				proxy.emit('update-topic', topic);
			})

			author.score += 1;
			author.comment_count += 3;
			author.save(function(err) {
				if (err) {
					return next();
				}
				proxy.emit('update-user');
			})
		});
	});	
};

/*
 * 修改一条评论
 * - 必须是管理员和评论者本身才有权限
 * - 评论内容不能为空
 * - 评论必须存在
 */
exports.update = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	var content = validator.trim(req.body.content);
	content = validator.escape(content);
	var cid = req.params.cid;
	var user_id = req.session.user._id;

	ep.on('update_err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			message: errMessage
		}
		res.json(data);
	});

	if (!content.length) {
		return ep.emit('update_err', 422, '评论内容不能为空');
	}

	if (cid.length !== 24) {
		return ep.emit('update_err', 410, '该评论不存在或者已经删除');
	}

	Comment.getCommentById(cid, function(err, comment) {
		if (!comment) {
			return ep.emit('update_err', 410, '该评论不存在或者已经删除');
		}
		if (!(comment.author_id.equals(user_id)) && !req.session.user.is_admin) {
			return ep.emit('update_err', 403, '没有权限');
		}
		comment.content = content;
		comment.save(function(err) {
			if (err) {
				return ep.emit('update_err', 500, '内部错误');
			}
			res.status(200);
			data = {
				errCode: 200,
				message: '更新成功'
			}
			res.json(data);
		});
	});
};

/*
 * 删除一条评论
 * - 必须是评论者本身或者管理员才能删除
 * - 必须删除存在的评论
 * - 评论者的评论总量减1
 * - 评论者的分数减5
 */ 
exports.delete = function(req, res, next) {
	var ep = new eventproxy();
	ep.fail(next);

	ep.on('delete_err', function(status, errMessage) {
		res.status(status);
		data = {
			errCode: status,
			message: errMessage
		}
		res.json(data);
	});

	var cid = req.params.cid;
	var user_id = req.session.user._id;

	if (cid.length != 24) {
		return ep.emit('delete_err', 410, '评论不存在或者已经删除');
	}
	Comment.getCommentDetail(cid, function(err, comment, author) {
		if (!(comment.author_id.equals(user_id)) && !req.session.user.is_admin)	{
			return ep.emit('delete_err', 403, '没有权限');
		}	

		var proxy = new eventproxy();
		proxy.all('comment_update', 'author_update', function() {
			res.status(200);
			data = {
				errCode: 200,
				message: '删除成功'
			}
			res.json(data);
		})

		if (err) {
			return ep.emit('delete_err', 500, '内部错误');
		}
		if (comment.deleted) {
			return ep.emit('delete_err', 410, '评论不存在或者已经删除');
		} else {
			comment.deleted = true;
			comment.save(proxy.done('comment_update'));

			author.score -= 3;
			author.comment_count -= 1;
			author.save(proxy.done('author_update'));
		}
	})
};
