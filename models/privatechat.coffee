mongodb = require './db.coffee'

class PrivateChat
    constructor: (chat)->
        @userName: chat.userName
        @chatName: chat.chatName
        @message: chat.message
        @time: chat.time

    save: (callback)->
        name = @chatName
        message = @message
        time = @time
        mongodb.open (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    mongodb.close()
                    return callback err
                collection.update({
                    "name": name
                })
