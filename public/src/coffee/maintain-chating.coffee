###
* A module to process the Ajax request
###

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
    ###
    * To check whether a user have chatted with before through Ajax
    * @param {String} myname: self name
    * @param {String} name: the user's name to be checked
    * @param {Function} callback: a function which be will fire after the checking 
    ###
    getEverChat: (myname, name, callback)->
        url = '/chat/' + myname + '/check-ever-chat/' + name
        $.ajax({
            type: "GET"
            url: url
            success: (data)->
                callback data
        }) 
    ###
    * To insert a user's name into the database through Ajax
    * @param {String} myname: self name
    * @param {String} name: the user's name to be inserted
    * @param {Function} callback: a function which will be fire after the insertion
    ###
    insertChater: (myname, name, callback)->
        url = '/chat/' + myname + '/insert-chater/' + name
        data =
            name: name
            myname: myname
        $.ajax({
            type: "POST"
            url: url
            data: data
            success: (data)->
                callback data
        })
    ###
    * Get 20 chats with a specific user
    * @param {String} myname: self name
    * @param {String} name: the user's name
    * @param {Number} start: the starting point of the query
    * @param {end} end: the ending point of the query
    * @param {Function} callback: a function which will be fire after the query
    ###
    getTwenty: (myname, name, start, end, callback)->
        url = '/chat/' + myname + '/get-chat/' + name + '/' + start + '/' + end
        $.ajax({
            type: "GET"
            url: url
            success: (data)->
                callback data
        })

    ###
    * Get 20 group chats
    * @param {Number} start: if there are group chats on the page and we need to 
    * load more chats, it is necessary to skip the existing chats.
    * @param {Function} callback: a function which will fire after the query.
    ###
    getGroupTwenty: (start, callback)->
        url = '/chat/group-chat/' + start
        
        $.ajax({
            type: "GET"
            url: url
            success: (data)->
                callback data
        })
        
module.exports = chatingState
