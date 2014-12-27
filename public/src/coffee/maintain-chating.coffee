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
    * Change the chating now user
    * @param {String} myname: the name of an entity of collection 'allPersonChat'
    * @param {String} name: the name we update with
    * @param {Function} callback: a function will fire after the update
    ### 
    updateChatingNowPerson: (myname, name, callback)->
        url = '/chat/' + myname + '/update-chating-person/' + name
        data =
            "myname": myname
            "name": name
        $.ajax({
            type: "POST"
            url: url
            data: data
            success: (data)->
                callback data
        })
    ###
    * when click ‘click button’ in the upper right corner of a chating user
    * remove him from the chating users at the database level
    ###
    removeUserFromChatList: (myname, name, callback)->
        url = '/chat/' + myname + '/remove-user/' + name
        console.log url
        $.ajax({
            type: "DELETE"
            url: url
        })
    ###
    * If an user click a live user to chat with,
    * insert him to the history chat person at the database level
    ###
    addChatPerson: (myname, userData, callback)->
        url = '/chat/' + myname + '/add-chat-person/' + userData.name
        data =
            myname: myname
            userData: userData
        $.ajax({
            type: 'POST'
            url: url
            data: data
        })
    ###
    * Check the name of user we chating with,then we can now whether we are at `private chat` mode

    ###
    isPrivateChat: ->
        isPrivate = if $chatPerson.text() is 'Live-Chat' then false else true
    loadHistory: (num)->
                

module.exports = chatingState
