var moment = require('moment');
var crypto = require('crypto');

moment.locale('zh-cn'); // 使用中文

exports.formatDate = function(date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }
};

exports.hashString = function(password) {
	var md5 = crypto.createHash('md5');
    var passHash = md5.update(password).digest('base64');

    return passHash;
}