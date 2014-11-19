config = require './config'
cookieParser = require('cookie-parser')()
session    = require('express-session')
MongoStore = require('connect-mongo')(session)

sessionInstance =
	secret: config.cookieSecret
	store: new MongoStore({
		db: config.db
	})
	resave: true
	saveUninitialized: true

sessionStore = session(sessionInstance)

module.exports = {cookieParser, sessionInstance, sessionStore}

