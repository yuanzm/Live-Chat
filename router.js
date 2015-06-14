/*!
 * route.js
 * Copyright(c) 2015 yuanzm <sysu.yuanzm@gmail.com>
 * MIT Licensed
 */

// 引入所需模块
var express 		 = require("express");
var auth 			 = require('./middlewares/auth');
var limit 			 = require('./middlewares/limit');
var site 			 = require("./controllers/site");
var sign 			 = require("./controllers/sign");
var user 			 = require("./controllers/user");
var notification     = require('./controllers/notification');
var topic 			 = require('./controllers/topic');
var comment 		 = require('./controllers/comment');
var search 			 = require('./controllers/search');
var topic_collect 	 = require('./controllers/topic_collect');
var staticController = require('./controllers/static');
var upload 			 = require('./controllers/upload');
var chat 			 = require('./controllers/chat');
var config 			 = require('./config');
var router           = express.Router();
// home page
router.get('/', site.index);
router.get('/chat', chat.index);

// 注册登录登出
router.get('/signup', sign.showSignUp);	// 渲染注册页面
router.post('/signup', sign.signUp);	// 登录请求
router.get('/signin', sign.showSignIn);	// 显示登录页面
router.post('/signin', sign.signIn);		// 登录请求
router.post('/signout', sign.signOut)	// 登出请求

// 用户
router.get('/user/:name', user.index);	// 显示用户个人中心
router.get('/setting', user.showSetting);	// 显示用户设置中心
router.post('/setting', auth.userRequired, user.setting);	// 更新用户设置请求	
router.get('/user/:name/collections', user.listCollectedTopics);	// 显示用户的收藏列表
// router.get('/user/:name/topics', user.listTopics);	// 显示用户的话题列表
router.get('/user/:name/comments', user.listComments);	// 显示用户的评论列表

// 消息
router.get('/my/notifications', auth.userRequired, notification.index);	// 显示用户的消息列表

// 话题
router.get('/topic/create', auth.userRequired, topic.showCreate);	// 创建一个新的话题页面
router.post('/topic/create', auth.userRequired, topic.create);		// 创建一个新的话题请求
router.get('/topic/:tid', topic.index);		// 一个话题的详情页面
router.get('/topic/:tid/edit', auth.userRequired, topic.showEdit);	// 话题编辑页面
router.post('/topic/:tid/update', auth.userRequired, topic.update);	// 更新话题请求
router.post('/topic/:tid/delete', auth.userRequired, topic.deleteTopic);	// 删除话题请求
router.post('/topic/:tid/up', auth.userRequired, topic.up); // 为评论点赞

// 收藏
router.post('/topic/:tid/collect', auth.userRequired, topic_collect.collect); // 收藏操作
router.post('/topic/:tid/de_collect', auth.userRequired, topic_collect.de_collect); // 取消收藏操作

// 评论
// limit.peruserperday('create_reply', config.create_reply_per_day)
router.post('/:tid/comment', auth.userRequired, comment.add);	//	添加评论请求操作
router.post('/comment/:cid/update', auth.userRequired, comment.update); // 修改某评论
router.post('/comment/:cid/delete', auth.userRequired, comment.delete); // 删除某评论

// 搜索
router.get('/search', search.index);

// 静态页面
router.get('/about', staticController.about);

// 上传文件
// router.post('/upload', auth.userRequired, upload.upload);	// 上传文件请求
router.get('/uptoken', auth.userRequired, upload.uptoken);
router.post('/downtoken', auth.userRequired, upload.downtoken);
	
module.exports = router;
