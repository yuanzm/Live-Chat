var config = require('../config');

exports.index = function(req, res) {
	res.render('pages/chat/index', {
		group_chat_id: config.group_chat_id
	});
}
