pool = require './db.coffee'

class PersonalChat
    constructor: (user)->
        @name = user.name
        @isChating = []
        @chats = []
     
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
                pool.release(db)
                return callback err
            query = {}
            if userName
                query.name = userName
            collection.findOne query, (err, doc)->
                pool.release(db)
                if (err)
                    return callback err, null
                if doc
                    callback null, doc
                else
                    callback null, null

PersonalChat.isChating = (myName, userName, callback)->
    pool.acquire (err, db)->
        if err
            return callback err
        db.collection 'allPersonChat', (err, collection)->
            if err
                return callback err
            collection.findOne({
                "name": myName
                "isChating": {$all:[userName]}
            },
            (err, doc)->
                pool.release db
                if doc
                    callback null, true
                else
                    callback null, false
            )

PersonalChat.insertChating = (myName, userName, callback)->
    pool.acquire (err, db)->
        if err
            callback err
        db.collection 'allPersonChat', (err, collection)->
            if err
                return callback err
            collection.update(
                {name: myName},
                {
                    $push: {"isChating": userName}
                },
                {multi:true,w: 1},
                (err)->
                    if err
                        return callback err
                    pool.release(db)
            )

PersonalChat.removeChating = (myName, userName, callback)->
    pool.acquire (err, db)->
        if err
            return callback err
        db.collection 'allPersonChat', (err, collection)->
            if err
                return callback err
            collection.update(
                {name: myName},
                {
                    $pull: {
                        "isChating": userName
                    }
                },
                {multi:true,w: 1},
                (err)->
                    if err
                        return callback err
                    pool.release db
            )

module.exports = PersonalChat