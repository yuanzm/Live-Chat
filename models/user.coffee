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
			if err
				mongodb.close()
				callback err
			collection.createIndex 'name', {unique: true}
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
					iser = new User(doc)
					callback err
				else
					callback err, null
