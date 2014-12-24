express = require('express')
router = express.Router()

PersonalChat = require '../models/personalchat.coffee'

router.get '/:name/chat-person', (req, res)->
    name = req.params.name
    PersonalChat.getChat name, (err, userData)->
        if err
            console.log err
        chatingUser = if userData then userData.isChating else []
        res.json(chatingUser)
        res.end()

router.get '/chat/chating-person/:name', (req, res)->
    name = req.param
    PersonalChat.getChat name, (err, userData)->
        if err
            console.log err
        chatingNow = if userData then userData.chatingNow else ''
        res.send(chatingNow)
        res.end()


module.exports = router