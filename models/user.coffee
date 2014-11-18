mongodb = require './db'

User = (user)->
	@.name = user.name
	@.password = user.password

module.exports = User

User.prototype.save = (callback)->
	user =
		name: @.name
		password: @.password

	mongodb.open (err, db)->
		if err
			callback err
		db.collection 'users', (err, collection)->
			# console.log 
			if err
				mongodb.close()
				callback err
			# collection.ensureIndex({'name': 1}, {unique: true})
			collection.insert user, {safe: true}, (err, user) ->
				mongodb.close()
				callback(err, user)

User.get = (username, callback)->
	mongodb.open (err, db)->
		if err
			callback err
		db.collection 'users', (err, collection)->
			if err
				mongodb.close()
				callback err
			collection.findOne {name: username}, (err, doc)->
				mongodb.close()
				if doc
					user = new User(doc)
					callback err, user
				else
					callback err, null
