pool = require './db.coffee'

###
* an entity of 'groupChat'
###
class Chat
	###
	* construct function
	* @param {Object} chat: an object contain the detail of one entity
	###
	constructor: (chat)->
		@receiverData = chat.receiverData
		@message = chat.message
		@time = chat.time
		@userName = chat.userName
	###
	* insert the entity into database
	* @param {Function} callback: a function will fire after the insertion
	###
	saveChat: (callback)->
		chat =
			userName: @userName
			time: @time
			message: @message
			receiverData: @receiverData

		pool.acquire (err, db)->
			if err
				callback err
			db.collection 'groupChat', (err, collection)->
				if err
					pool.release(db)
					callback err

				collection.insert chat, {save: true}, (err, chat) ->
					pool.release(db)
					
Chat.getTwenty = (userName, page, callback)->
	pool.acquire (err, db)->
		if err
			callback err
		db.collection 'groupChat', (err, collection)->
			if err
				pool.release(db)
				callback err
			query = {}
			if userName
				query.userName = userName
			collection.count query, (err, total)->
				collection.find(query, {skip: (page - 1) * 20, limit: 20}).sort({time: 1}).toArray (err, docs)->
					pool.release(db)
					if err
						callback err, null
					chats = []
					for doc, index in docs
						chat = new Chat(doc)
						chats.push chat
					callback null, chats
module.exports = Chat
