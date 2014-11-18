express = require 'express'
path = require 'path'
favicon = require 'static-favicon'
logger = require 'morgan'
cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
session    = require('express-session')
MongoStore = require('connect-mongo')(session)
config = require './config'

# db = require './db/db.coffee'
routes = require './routes/index'

app = express()

app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'jade'

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