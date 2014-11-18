express = require 'express'
path = require 'path'
favicon = require 'static-favicon'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
session    = require('express-session')
MongoStore = require('connect-mongo')(session)
config = require './config'
flash = require 'connect-flash'

# db = require './db/db.coffee'
routes = require './routes/index'

app = express()

app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'jade'

app.use flash()
app.use favicon()
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded()
app.use cookieParser()
app.use express.static(path.join(__dirname, 'public'))
app.use session({
	secret: config.cookieSecret
	store: new MongoStore({
		db: config.db
	})
	resave: true
	saveUninitialized: true
})

app.use (req, res, next)->
	console.log "A new requset"
	res.locals.user = req.session.user
	res.locals.port = req.session.port
	error = req.flash 'error'
	res.locals.error = if error.length then error else null

	success = req.flash 'success'
	res.locals.success = if success.length then success	else null
	next()


app.use '/', routes

app.use (req, res, next)->
	err = new Error("Not Found")
	err.status = 404
	next err

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