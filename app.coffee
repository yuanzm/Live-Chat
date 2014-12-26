express = require 'express'
passport = require 'passport'
GithubStrategy = require('passport-github').Strategy
path = require 'path'
favicon = require 'static-favicon'
logger = require 'morgan'
bodyParser = require 'body-parser'
flash = require 'connect-flash'
sessionConfig = require './session-config.coffee'

routes = require './routes/index.coffee'
chat = require './routes/privatechat.coffee'

app = express()

app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'jade'

app.use flash()
app.use favicon()
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded()
app.use express.static(path.join(__dirname, 'public'))
app.use sessionConfig.cookieParser
app.use sessionConfig.sessionStore

app.use (req, res, next)->
	console.log "A new requset"
	res.locals.user = req.session.user
	res.locals.port = req.session.port
	error = req.flash 'error'
	res.locals.error = if error.length then error else null

	success = req.flash 'success'
	res.locals.success = if success.length then success	else null
	next()

app.use passport.initialize()
app.use '/', routes
app.use '/chat', chat

app.use (req, res, next)->
	err = new Error("Not Found")
	err.status = 404
	next err

passport.use new GithubStrategy({
	clientID: '137f657d33844175f220'
	clientSecret: '876984707be52ae1e149b4bf92f772fb99f3cf03'
	callbackURL: 'http://localhost:3000/login/github/callback'
},
(accessToken, refreshToken, profile, done)->
	done(null, profile)
)

if app.get('env') is 'development'
	app.use (err,req,res, next)->
		res.status err.status ||500
		res.render 'error', {
			message: err.message
			error: err
		}

app.use (err, req,res, next)->
	res.status(err.status || 500)
	res.render 'error', {
		message: err.message
		error: {}
	}

module.exports = app