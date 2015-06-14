var User = require('../proxy').User;
var config = require('../config');
var validator = require('validator');
var eventproxy     = require('eventproxy');
var crypto = require('crypto');
var authMiddleWare = require('../middlewares/auth');

exports.showSignUp = function(req, res){
    res.render('pages/sign/signup');
}

exports.signUp = function(req, res, next) {
    var ep = new eventproxy();
    ep.fail(next);
    ep.on('sign_err', function(errMessage) {
        data = {
            errCode: 422,
            message: errMessage
        }

        res.json(data);
    })

	var loginname = req.body.loginname;
    var email = req.body.email;
    var avatar = req.body.avatar;
    var password = req.body.password;
    var rePassword = req.body.rePassword;

    // 验证信息的完整性
    if ([loginname, email, avatar, password].some(function(item) {return item === ''})) {
        return ep.emit('sign_err', '信息填写不完整');
    }
    if (!validator.isEmail(email)) {
        return ep.emit('sign_err', '邮箱不符合格式要求');
    }
    if (!loginname.length >= 4) {
        return ep.emit('sign_err', '用户名至少由四个字符组成');
    }
    if (password !== rePassword) {
        return ep.emit('sign_err', '两次输入的密码不一致');
    }

    User.getUserByQuery({
        '$or': [{'loginname': loginname}, {'email': email}]
    }, function(err, users) {
        if(err) {
            return next(err);
        }
        if (users.length) {
            return ep.emit('sign_err', '该用户名邮箱已经被使用');
        }
        var md5 = crypto.createHash('md5');
        var passHash = md5.update(password).digest('base64');

        User.newAndSave(loginname, passHash, email, avatar, function(err, user) {
            if (err) {
                return next(err);
            }
            res.status(200);
            data = {
                errCode: 200,
                message: '注册成功'
            }
            req.session.user = user;
            res.json(data);
        })
    })
}

exports.showSignIn = function(req, res) {
    res.render('pages/sign/signin');
}

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/active_account', //active page
  '/reset_pass',     //reset password page, avoid to reset twice
  '/signup',         //regist page
  '/search_pass'    //serch pass page
];

exports.signIn = function(req, res, next) {
    var loginname = validator.trim(req.body.loginname);
    var password = validator.trim(req.body.password);

    var ep = new eventproxy();
    ep.fail(next);
    ep.on('login-err', function(errMessage) {
        // res.status(422);
        data = {
            errCode: 422,
            message: errMessage
        }
        res.json(data);
    });

    ep.on('loginname-err', function(errMessage) {
        // res.status(403);
        data = {
            errCode: 403,
            message: errMessage
        }
        res.json(data);
    })

    if ([loginname, password].some(function(item) {return item === ''})) {
        return ep.emit('login-err', '信息填写不完整');
    }
    var getUser = loginname.indexOf('@') > -1 ? User.getUserByEmail : User.getUserByLoginName;

    getUser(loginname, function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return ep.emit('login-err', '用户名不存在');
        }
        var md5 = crypto.createHash('md5');
        passHash = md5.update(password).digest('base64')
        if (user.password !== passHash) {
            return ep.emit('loginname-err', '用户密码错误');
        }
        // 存储session cookie
        authMiddleWare.gen_session(user, res);
        // check at some page just jump to home page
        var refer = req.session._loginReferer || '/';
        for (var i = 0, len = notJump.length; i !== len; ++i) {
            if (refer.indexOf(notJump[i]) >= 0) {
                refer = '/';
                break;
            }
        }
        data = {
            errCode: 0,
            refer: refer,
            message: "登录成功"
        }
        // 存储session cookie
        authMiddleWare.gen_session(user, res).status(200).json(data);
    })
}

exports.signOut = function(req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    var data = {
        errCode: 200,
        message: '登出成功'
    }
    res.json(data);
}
