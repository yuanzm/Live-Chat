var models = require('../models');
var Comment = models.Comment;
var UserProxy = require('./user.js');
var eventproxy = require('eventproxy');

exports.getLastCommentById = function() {

}

/*
 * @param {String} content: 评论的内容
 * @param {ObjectId} topic_id: 话题的id
 * @param {ObjectId} author_id: 话题作者的id
 * @param {ObjectId} comment_id: 该条评论的id
 */
exports.newAndSave = function(content, topic_id, author_id, comment_id, callback) {
    var comment = new Comment();
    comment.content = content;
    comment.topic_id = topic_id;
    comment.author_id = author_id;
    comment.comment_id = comment_id;
    comment.save(callback);
}

exports.getCommentById = function(id, callback) {
	Comment.findOne({"_id": id}, callback);
}

/*
 * 获取一条评论的详情
 * @param {String} id: 评论的id
 *	- comment: 评论的具体内容
 *	- author: 评论的作者详情
 */ 
exports.getCommentDetail = function(id, callback) {
	var ep = new eventproxy();
	ep.fail(callback);

	ep.all('comment', 'author', function(comment, author) {
		if (!comment) {
			callback(null, null, null);
		} else {
			callback(null, comment, author);
		}
	})
	Comment.findOne({'_id': id}, function(err, comment) {
		if(!comment) {
			ep.emit('comment', null);
			ep.emit('author', null);
		} else {
			ep.emit('comment', comment)
			var author_id = comment.author_id;

			UserProxy.getUserById(author_id, ep.done('author'));
		}
	})
}

/*
 * 根据查询获取评论
 */
exports.getUserCommentByQuery = function(query, opt, callback) {
	Comment.find(query, {}, opt, callback);
}

/*
 * 根据用户的id获取评论总量
 */
exports.getUserCommentCounetById = function(author_id, callback) {
	Comment.find({'author_id': author_id}, callback)
}
