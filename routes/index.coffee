passport = require 'passport'
express = require('express')
router = express.Router()

crypto = require 'crypto'
User = require '../models/user.coffee'
Chat = require '../models/chat.coffee'
PersonalChat = require '../models/personalchat.coffee'

 # GET home page.
router.get '/', (req, res)->
	allChats = null
	if req.session.user
		myName = req.session.user.name
		chatingUser = []
		allChats = Chat.getChat null, (err, chats)->
			if err
				chats = []
			res.render 'chat', {
				title: "Live-Chat"
				user: req.session.user
				chats: chats
			}
	else
		res.render 'chat', {
			className: ''
			title: "Live-Chat"
			chatingUser: []
		}


router.get '/regist', (req, res)->
	res.render 'regist',{
		title: "Regist"
	}

router.post '/regist', (req, res)->
	md5 = crypto.createHash 'md5'
	password = md5.update(req.body.passWord).digest('base64')
	md5 = crypto.createHash 'md5'
	email_MD5 =  md5.update(req.body.email.toLowerCase()).digest('hex')
	console.log email_MD5
	head = "http://secure.gravatar.com/avatar/" + email_MD5 + "?s=48"

	newUser = new User({
		name: req.body.nickName
		password: password
		email: req.body.email
		head: head
	})
	newPersonalChat = new PersonalChat({
		name: req.body.nickName
	})
	User.get newUser.name, (err, user)->
		if user
			err = '用户已存在！'
		if err
			req.flash 'error', err
			return res.redirect '/regist'
		newUser.save (err)->
			if err
				req.flash 'error', err
			newPersonalChat.save (err)->
				if err
					req.flash 'error', err
			req.session.user = newUser
			req.flash 'success', 'regist success'
			res.redirect '/'

router.get '/login', (req, res)->
	res.render 'login', {
		title: "Login"
	}

router.get '/login/github', passport.authenticate('github', {session: false})
router.get('/login/github/callback', passport.authenticate('github', {
	session: false
	failureRedirect: '/login'
	successFlash: '登录成功！'
	}),
	(req, res)->
		console.log req.user
		req.session.user = {name: req.user.username, head: req.user._json.avatar_url}
		res.redirect('/')
)
router.post '/login', (req, res)->
	md5 = crypto.createHash 'md5'
	password = md5.update(req.body.passWord).digest('base64')
	nickName = req.body.nickName

	User.get nickName, (err, user)->
		if err
			req.flash 'error', err
			return res.redirect '/login'
		if not user
			req.flash 'error', '用户不存在！'
			return res.redirect '/login'
		if user.password != password
			req.flash 'error', '用户密码错误！'			
			return res.redirect '/login'
		req.session.user = user
		req.flash 'success', '登录成功~'
		res.redirect '/'


router.get '/logout', (req, res)->
	req.session.user = null
	req.flash('success', '登出成功')
	res.redirect '/'


router.post '/addChat', (req, res)->
	newChat = new Chat(req.body)
	newChat.saveChat()
	res.send('ok')

module.exports = router;