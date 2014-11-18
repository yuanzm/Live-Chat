express = require('express')
router = express.Router()

 # GET home page.

router.get '/', (req, res)->
	res.render 'index', {
		title: "Live-Chat"
	}

router.get '/signinup', (req, res)->
	res.render 'signinup', {

	}
	
module.exports = router;
