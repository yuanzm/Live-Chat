pool = require './db.coffee'

class PersonalChat
    ###
    * Constructor function
    * @param {Object} user: an object contain user's name
    ###
    constructor: (user)->
        @name = user.name
        @chatNow = ''
        @isChating = []
        @chats = []
    ###
    * Insert a data inside the database
    * @param {Function} callback: a function will fire after the insertion
    ###
    save: (callback)->
        personalChat =
            name: @name
            isChating: @isChating
            chats: @chats
            chatNow: @chatNow
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
###
* get a 'PersonalChat' from database
* @param {String} userName: the name we need wo query
* @param {Function} callback: a function will fire after the query
###
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
###
* To check whether an user is in chat list
* @param {String} myName: the name of 'PersonalChat'
* @param {String} userName: the name we need to check
* @param {Function} callback: a function will fire after the query
###
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

###
* To insert a chating user into a specific 'PersonalChat'
* @param {String} myName: the name of 'PersonalChat'
* @param {Object} chatData: an object contain the data of chat user
* @param {Function} callback: a function will fire after the insertion
###
PersonalChat.insertChating = (myName, chatData, callback)->
    pool.acquire (err, db)->
        if err
            callback err
        db.collection 'allPersonChat', (err, collection)->
            if err
                return callback err
            collection.update(
                {name: myName},
                {
                    $push: {"isChating": chatData}
                },
                {multi:true,w: 1},
                (err)->
                    if err
                        return callback err
                    pool.release(db)
            )

###
* To remove a chating user into a specific 'PersonalChat'
* @param {String} myName: the name of 'PersonalChat'
* @param {String} userName: the user's name wo need to remove
* @param {Function} callback: a function will fire after the insertion
###
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
                        "isChating.$.name": userName
                    }
                },
                {multi:true,w: 1},
                (err)->
                    if err
                        return callback err
                    pool.release db
            )
###
* To update the chating now user for specific 'PersonalChat'
* @param {String} myName: the name of 'PersonalChat'
* @param {String} userName: the user's name wo need to update
* @param {Function} callback: a function will fire after the update
###
PersonalChat.updateChatingNowUser = (myName, username, callback)->
    pool.acquire (err, db)->
        if err
            return callback err
        db.collection 'allPersonChat', (err, collection)->
            if err
                return callback err
            collection.update(
                {name: myName},
                {
                    $set: {'chatNow': username}
                },
                (err)->
                    if err
                        return callback err
                    pool.release(db)
            )

module.exports = PersonalChat