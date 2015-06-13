# 对接文档

## 注册登录模块
- 注册一个新用户
	+ type: post
	+ url: `/signup`
	+ data: 
		- loginname: `String`: 新用户的登录名
		- email: `String`: 新用户的邮箱
		- avatar: `String`: 新用户的头像地址
		- password: `String`: 新用户的密码
		- rePassword: `String`: 新用户的重复密码
	+ response：
		- 422:
			+ 信息填写不完整
			+ 邮箱不符合格式要求
			+ 用户名至少由四个字符组成
			+ 两次输入的密码不一致
		- 200: 注册成功

- 用户登录
	+ type: post
	+ url: `/signin`
	+ data: 
		- loginname: `String`: 登录名
		- password: `String`: 邮箱
	+ response：
		- 422:
			+ 信息填写不完整
			+ 用户名不存在
		- 403: 用户密码错误
		- 200:登录成功
		- refer: 跳转页面

- 登出
	+ type: post
	+ url: `/signout`
	+ data: null
	+ response: null

## 话题模块
- 发布一个话题
	+ type: post
	+ url: `/topic/create`
	+ data: 
		- title: `String`: 话题的标题
		- content: `String`: 话题的内容
	+ response:
		- 422: 内容或标题不能为空
		- 200: 发表成功
- 删除一条话题
	+ type: post
	+ url: `/topic/:tid/delete`
	+ data: null
	+ response:
		- 200: 删除成功
		- 410: 帖子不存在或者已经删除
		- 403: 没有权限删除帖子

- 更新一条话题
	+ type: post
	+ url: `/topic/:tid/update`
	+ data: 
		- title: `String` 话题的标题
		- content: `String` 话题的内容
	+ response:
		- 200: 更新成功
		- 410: 帖子不存在或者已经删除
		- 403: 没有权限
		- 500: 内部错误

- 话题点赞操作
	+ type: post
	+ url: `/topic/:tid/up`
	+ data: null
	+ response:
		- 410: 该话题不存在
		- 501: 数据库错误
		- 200: 点赞操作成功

## 评论模块
- 新建一条评论
	+ type: post
	+ url: `/:tid/comment`
	+ data:
		- content: `String`: 评论的内容
	+ response:
		- 200: 评论成功
		- 422: 评论内容不能为空

- 更新一条评论
	+ type: post
	+ url: `/comment/:cid/update`
	+ data: 
		- content: `String` 新的评论内容
	+ response:
		- 200: 更新成功
		- 410: 评论不存在或者已经删除
		- 403: 没有权限
		- 500: 内部错误

- 删除一条评论
	+ type: post
	+ url: `/comment/:cid/delete`
	+ data: null
	+ response:
		- 200: 删除成功
		- 410: 评论不存在或者已经删除
		- 403: 没有权限

## 收藏模块
- 收藏一条帖子
	+ type； post
	+ url: `/topic/:tid/collect`
	+ data: null
	+ response:
		- 200: 收藏成功
		- 403: 不能重复收藏
		- 500: 内部错误
		- 410: 帖子不存在

- 取消收藏一条帖子
	+ type: post
	+ url: `/topic/:tid/de_collect`
	+ data: null
	+ response:
		- 410: 
			+ 帖子不存在
			+ 未收藏不能取消
		- 200:取消收藏成功
		- 500: 内部错误
		