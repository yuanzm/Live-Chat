express = require('express')
router = express.Router()

crypto = require 'crypto'
User = require '../models/user.coffee'


 # GET home page.

router.get '/', (req, res)->
	res.render 'index', {
		title: "Live-Chat"
	}

router.get '/signinup', (req, res)->
	res.render 'signinup', {

	}
	
router.post '/signinup', (req, res)->
	console.log 123123
	# md5 = crypto.createHash 'md5'
	# password = md5.update(req.body.password).digest('base64')
	password = req.body.password

	newUser = new User({
		name: req.body.nickName
		password: password
	})
	User.get newUser.name, (err, user)->
		if user
			err = 'Username already exists'
		if err
			req.flash 'error', err
			res.redirect '/'
		newUser.save (err)->
			if err
				req.flash 'error', err
				res.redirect '/signinup'
				req.session.user = newUser
				req.flash 'success', 'regist success'

module.exports = router;
