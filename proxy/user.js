var models = require('../models');
var User   = models.User;

exports.getUserByLoginName = function(loginname, callback) {
    User.findOne({'loginname': loginname}, callback);
}

exports.getUserById = function(id, callback) {
    User.findOne({"_id": id}, callback);
}

exports.getUserByEmail = function(email, callback) {
    User.findOne({'email': email}, callback);
}

exports.getUserByIds = function(ids, callback) {
    User.find({'_id': {$in: ids}}, callback);
}

exports.getUserByQuery = function(query, callback) {
    User.find(query, callback);
}

exports.newAndSave = function(loginname, password, email, avatar, callback) {
    var user = new User();
    user.loginname = loginname;
    user.password  = password;
    user.email     = email;
    user.avatar    = avatar

    user.save(callback);
}
