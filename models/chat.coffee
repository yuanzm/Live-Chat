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

Chat.getChat = (userName, callback)->
	mongodb.open (err, db)->
		if err
			callback err
		db.collection 'groupChat', (err, collection)->
			if err
				mongodb.close()
				callback err
			query = {}
			if userName
				query.userName = userName
			collection.count query, (err)->
				collection.find(query, {skip: 10, limit: 50}).sort({time: 1}).toArray (err, docs)->
					mongodb.close()
					if err
						callback err
					chats = []
					for doc, index in docs
						chat = new Chat(doc)
						chats.push chat
					callback null, chats
module.exports = Chat
