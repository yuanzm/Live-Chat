pool = require './db.coffee'
crypto = require 'crypto'

User = (user)->
	@name = user.name
	@password = user.password
	@email = user.email
	@head = user.head

module.exports = User

User.prototype.save = (callback)->
	user =
		name: @name
		password: @password
		email: @emial
		head: @head

	pool.acquire (err, db)->
		if err
			callback err
		db.collection 'users', (err, collection)->
			if err
				pool.release(db)
				callback err
			# collection.ensureIndex({'name': 1}, {unique: true})
			collection.insert user, {safe: true}, (err, user) ->
				pool.release(db)
				callback(err, user)

User.get = (username, callback)->
	pool.acquire (err, db)->
		if err
			callback err
		db.collection 'users', (err, collection)->
			if err
				pool.release(db)
				callback err
			collection.findOne {name: username}, (err, doc)->
				pool.release(db)
				if doc
					user = new User(doc)
					callback err, user
				else
					callback err, null
