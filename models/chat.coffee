mongodb = require './db.coffee'

class Chat
	constructor: (@userName, @time, @message)->

	saveChat: (callback)->
		chat =
			userName: @userName
			time: @time
			message: @message

		mongodb.open (err, db)->
			if err
				callback err
			db.collection 'groupChat', (err, collection)->
				if err
					mongodb.close()
					callback err

				collection.insert chat, {save: true}, (err, user) ->
					mongodb.close()
					callback err
