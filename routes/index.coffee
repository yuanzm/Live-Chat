express = require('express')
router = express.Router()

crypto = require 'crypto'
User = require '../models/user.coffee'


 # GET home page.
router.get '/', (req, res)->
	res.render 'index', {
		title: "Live-Chat"
	}

router.get '/regist', (req, res)->
	res.render 'regist',{

	}

router.post '/regist', (req, res)->
	md5 = crypto.createHash 'md5'
	password = md5.update(req.body.passWord).digest('base64')
	# password = req.body.passWord

	newUser = new User({
		name: req.body.nickName
		password: password
	})
	User.get newUser.name, (err, user)->
		if user
			err = 'Username already exists'
		if err
			req.flash 'error', err
			return res.redirect '/regist'
		newUser.save (err)->
			if err
				req.flash 'error', err
			res.redirect '/'
			req.session.user = newUser
			req.flash 'success', 'regist success'

module.exports = router;
