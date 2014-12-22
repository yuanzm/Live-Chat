mongodb = require './db.coffee'

class PrivateChat
    constructor: (userName, chat)->
        @userName = userName   #用于查找的用户名
        #聊天信息的具体内容
        @chatName = chat.receiverData.name #聊天对象  
        @message = chat.message #聊天信息具体内容
        @time = chat.time #聊天信息发送时间

    saveChat: (callback)->
        userName = @userName
        chatName = @chatName
        #聊天信息的具体内容
        chat =
            message: @message
            time: @time
        mongodb.open (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    mongodb.close()
                    return callback err
                collection.update(
                    {
                        "name": userName
                    },
                    {
                        $push: {
                            "chats.$.chatName": chat
                        }
                    },
                    {multi:true,w: 1}
                    (err)->
                        mongodb.close()
                        if (err)
                            return callback err
                        callback null
                )
    insertChater: (callback)->

    getEverChat: (callback)->
        chatName = @chatName
        mongodb.open (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    return callback err
                collection.find({
                    "chats.onePrivate"
                },
                {
                    
                }
                )

module.exports = PrivateChat