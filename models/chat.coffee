mongodb = require './db.coffee'

class Chat
	constructor: (chat)->
		@message = chat.message
		@time = chat.time
		@userName = chat.userName

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

				collection.insert chat, {save: true}, (err, chat) ->
					mongodb.close()

module.exports = Chat
	
