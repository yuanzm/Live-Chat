$chatPerson = $('#chat-person')

chatingState =
    ###
    * When a user login successful or refresh page, 
    * query the users in the chat list
    * @param {String} name: the name we need to query
    * @param {Function} callback: a function will fire when load the data successfully  
    ###
    getChatPersonsData: (name, callback)->
        url = "/chat/" + name + '/chat-person'
        $.ajax({
            type: "GET"
            url: url
            success: (data)->
                callback data
        })
    ###
    * When a user login successful or refresh page,
    * query the user chating now
    ###
    getChatingNowPerson: (name, callback)->
        url = '/chat/chating-person/' + name
        $.ajax({
            type: "GET"
            url: url
            success: (data)->
                callback data
        })
    ###
    * when click ‘click button’ in the upper right corner of a chating user
    * remove him from the chating users at the database level
    ###
    removeUserFromChatList: (name, callback)->
        url = '/chat/remove-user' + name
        $.ajax({
            type: "DELETE"
            url: url
        })
    ###
    * If an user click a live user to chat with,
    * insert him to the history chat person at the database level
    ###
    addChatPerson: (name)->
        url = '/chat/add-chat-person' + name
        $.ajax({
            type: 'POST'
            url: url
            data: name
        }) 
    isPrivateChat: ->
        isPrivate = if $chatPerson.text() is 'Live-Chat' then false else true
    loadHistory: (num)->
                

module.exports = chatingState
