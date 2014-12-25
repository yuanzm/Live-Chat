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
        res.end()

router.post '/:myname/update-chating-person/:name', (req, res)->
    name = req.body.name
    myname = req.body.myname
    # console.log req.body
    PersonalChat.updateChatingNowUser myname, name, (err)->
        if err
            console.log err
        res.send('ok') 
        res.end()

router.delete '/:myname/remove-user/:name', (req, res)->
    myname = req.params.myname
    name = req.params.name
    console.log myname
    PersonalChat.removeChating myname, name, (err)->
        if err
            console.log err
        res.send('ok')
        res.end()
module.exports = router