mongodb = require './db.coffee'

#用于操作个人聊天记录
class PrivateChat
    constructor: (myName, chat)->
        @receiverName = chat.receiverData.name  #聊天对象
        #聊天信息的具体内容
        @myName = myName #自己的名字  
        @message = chat.message #聊天信息具体内容
        @time = chat.time #聊天信息发送时间

    saveChat: (callback)->
        senderName = @senderName
        myName = @myName
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
                        "name": senderName
                    },
                    {
                        $push: {
                            "chats.$.myName": chat
                        }
                    },
                    {multi:true,w: 1}
                    (err)->
                        mongodb.close()
                        if (err)
                            return callback err
                        callback null
                )
    ###
    * If an user is not in the history list,insert it to database
    ###
    insertChater: (callback)->
        senderName = @senderName
        myName = @myName
        oneChat =
            myName: myName
            chatContent: []
        mongodb.open (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    return callback err
                collection.update(
                    {
                        "name": myName
                    },
                    {
                        $push: {
                            "chats": oneChat 
                        }
                    },
                    {multi:true,w: 1},
                    (err)->
                        mongodb.close()
                        if err
                            return callback err
                )

    getEverChat: (callback)->
        receiverName = @receiverName
        mongodb.open (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    return callback err
                # 查找自己本身的聊天记录
                collection.findOne({
                    "chats.chatName" : receiverName
                },
                (err, doc)->
                    mongodb.close()
                    if doc
                        callback null, true 
                    else
                        callback null, false
                )
module.exports = PrivateChat