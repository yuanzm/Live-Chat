
chatingState =
    ###
    * When a user login successful or refresh page, 
    * query the user chat with now
    ###
    getChatPersons: ->
    ###
    * query all the users have been chatted with
    ###
    getHistoryChatPerson: ->
    ###
    * When a user login successful or refresh page,
    * query users in the chating users list
    ###
    getIsChatingPerson: ->
    ###
    * when click ‘click button’ in the upper right corner of a chating user
    * remove him from the chating users at the database level
    ###
    removeAIsChatingPerson: ->
    ###
    * If an user click a live user to chat with,
    * insert him to the history chat person at the database level
    ###
    addChatPerson: ->