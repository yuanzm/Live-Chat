pool = require './db.coffee'

###
* an eitity of an Embedded sud-document of collection 'allPersonChat'
###
class PrivateChat
    ###
    * construct function
    * @param {String} myName: name attribute of an entity of 'allPersonChat'
    * @param {String} chatName: chatName attribute of the Embedded sud-document
    * @param {Object} chat: an object contain the detail message
    ###
    constructor: (myName, chatsName, chat)->
        @chatsName = chatsName  #聊天对象
        #聊天信息的具体内容
        @myName = myName #自己的名字  
        @message = chat.message #聊天信息具体内容
        @time = chat.time #聊天信息发送时间
    ###
    * Insert an data to a specific  Embedded sud-document
    * @param {Function} callback: a function will fire after the insertion
    ###
    saveChat: (callback)->
        chatsName = @chatsName
        myName = @myName
        #聊天信息的具体内容
        chat =
            "message": @message
            "time": @time
        pool.acquire (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    pool.release(db)
                    return callback err
                collection.update(
                    {
                        "name": myName
                        "chats.chatName": chatsName
                    },
                    {
                        $push: {
                            "chats.$.chatContent": chat
                        }
                    },
                    {multi:true,w: 1}
                    (err)->
                        pool.release(db)
                        if (err)
                            return callback err
                        callback null
                )
    ###
    * insert an entity of the Embedded sud-document into the collection 'allPersonChat'
    * @param {Function} callback: a function will fire after the insertion
    ###
    insertChater: (callback)->
        chatsName = @chatsName
        myName = @myName
        oneChat =
            chatName: chatsName
            chatContent: []
        pool.acquire (err, db)->
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
                        pool.release(db)
                        if err
                            return callback err
                )
    ###
    * check whether an user is in the 'isChating' list
    * @param {Function} callback: a function will fire after the query
    ###
    getEverChat: (callback)->
        chatsName = @chatsName
        myName = @myName
        pool.acquire (err, db)->
            if err
                return callback err
            db.collection 'allPersonChat', (err, collection)->
                if err
                    return callback err
                # 查找自己本身的聊天记录
                collection.findOne({
                    "name": myName
                    "chats.chatName" : chatsName
                },
                (err, doc)->
                    pool.release(db)
                    if doc
                        callback null, true 
                    else
                        callback null, false
                )
module.exports = PrivateChat