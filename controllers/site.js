//sign up
exports.index = function (req, res) {
	if (req.session.user) {
	  	res.render('index', {
	  		user: req.session.user
	  	});
	} else {
		res.render('index', {
			user: null
		});
	}
};
