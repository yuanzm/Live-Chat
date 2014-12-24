pool = require './db.coffee'
crypto = require 'crypto'

###
* An entity of an user
* @param {Object} user: an object contain the detail message of the user
###
User = (user)->
	@name = user.name
	@password = user.password
	@email = user.email
	@head = user.head

###
* insert an entity to collection `users`
* @param {Function} callback: a function will fire after the insertion
###
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

###
* Check whether an user is in the collection `users`
* @param {String} userName: the name need to be checked
* @param {Function} callback: a function will fire after the query
###
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
module.exports = User
