express = require('express')
router = express.Router()

PersonalChat = require '../models/personalchat.coffee'

router.get '/:name/chat-person', (req, res)->
    name = req.params.name
    PersonalChat.getChat name, (err, userData)->
        if err
            console.log err
        # chatingUser = if userData then userData.isChating else []
        
        res.json(userData)

router.post '/:myname/update-chating-person/:name', (req, res)->
    name = req.body.name
    myname = req.body.myname
    # console.log req.body
    PersonalChat.updateChatingNowUser myname, name, (err)->
        if err
            console.log err
    res.json({result: 'ok'})
router.delete '/:myname/remove-user/:name', (req, res)->
    myname = req.params.myname
    name = req.params.name
    PersonalChat.removeChating myname, name, (err)->
        if err
            console.log err
        res.json({result: 'ok'}) 
router.post '/:myname/add-chat-person/:name', (req, res)->
    myname = req.body.myname
    userData = req.body.userData
    PersonalChat.insertChating myname, userData, (err)->
        if err
            console.log err
        res.json({result: 'ok'})

router.get '/:myname/check-ever-chat/:name', (req, res)->
    myname = req.params.myname
    name = req.params.name
    PersonalChat.getEverChat myname, name, (err, ever)->
        if err
            console.log err
        res.send(ever)
        res.end()

router.post '/:myname/insert-chater/:name', (req, res)->
    myname = req.body.myname
    name = req.body.name
    PersonalChat.insertChater myname, name, (err)->
        if err
            console.log err
        res.json({result: 'ok'})

router.get '/:myname/get-chat/:name/:start/:end', (req, res)->
    myname = req.params.myname
    name = req.params.name
    start = req.params.start
    end = req.params.end
    chats = null
    PersonalChat.getTwenty myname, name, start, end, (err, data)->
        if err
            console.log err
        chats = data
    res.json chats
module.exports = router