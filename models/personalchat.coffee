pool = require './db.coffee'

class PersonalChat
    constructor: (user)->
        @name = user.name
        @historyChaters = []
        @isChating = []
        @chats = [{
            chatName: '',
            chatContent: []
        }]
     
    save: (callback)->
        personalChat =
            name: @name
            historyChaters: @historyChaters
            isChating: @isChating
            chats: @chats
        pool.acquire (err, db)->
            if err
                callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    pool.release(db)
                    callback err
                collection.insert personalChat, {
                    save: true
                }, (err, chat)->
                    pool.release(db)

PersonalChat.getChat = (userName, callback)->
    pool.acquire (err, db)->
        if (err)
            callback err
        db.collection 'allPersonChat', (err, collection)->
            if (err)
                callback err
            query = {}
            if chatUser
                query.userName = userName
            collection.find(query).sort({name: -1}).toArray (err, docs)->
                pool.release(db)
                if (err)
                    return callback err
                callback null, docs

module.exports = PersonalChat