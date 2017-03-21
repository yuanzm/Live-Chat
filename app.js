/*
 * app.js
 */

var config = require('./config')

require('colors');  //给控制台输出加上颜色。
var path                = require("path");
var Loader              = require("loader");
var express             = require("express");
var errorhandler        = require('errorhandler');
var session             = require('express-session');
var passport            = require("passport");
require('./models');
var router              = require("./router")
var auth                     = require('./middlewares/auth');
var errorPageMiddleware = require("./middlewares/error_page");
var MongoStore = require('connect-mongo')(session);
var _                   = require('lodash');
var csurf               = require('csurf');
var compress            = require('compression');
var bodyParser          = require('body-parser');
var requestLog          = require('./middlewares/request_log');
var errorhandler        = require('errorhandler');
var renderMiddleware    = require('./middlewares/render');
var logger              = require("./common/logger");
var busboy              = require('connect-busboy');
// 静态文件目录
var staticDir = path.join(__dirname, 'public');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');

var urlinfo     = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

// Request logger 请求时间
app.use(requestLog);

if (config.debug) {
  // log页面渲染时间
  app.use(renderMiddleware.render);
}

// 静态资源
app.use(Loader.less(__dirname));  //拦截less请求，把less解析成css
app.use('/public', express.static(staticDir));

// 每日访问限制

app.use(require('response-time')());  //记录响应时间
app.use(bodyParser.json({limit: '1mb'})); //限制post请求的req.body大小为1M以下
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' })); //限制get请求的req.body大小为1M以下
app.use(require('method-override')());  //重写http请求的方法（post、get、put、delete）
var cookieParser = require('cookie-parser')(config.session_secret);
app.use(cookieParser);
app.use(compress());

var session = session({
  secret: config.session_secret,
  store: new MongoStore({
    url: config.db
  }),
  resave: true,
  saveUninitialized: true,
})
app.use(session);

// custom middleware
app.use(auth.authUser); //验证用户是否登录
// app.use(auth.blockUser());

if (!config.debug) {
  app.use(function (req, res, next) {
    if (req.path.indexOf('/api') === -1) {  //如果不是对外提供接口，就进行CSRF防御
      csurf()(req, res, next);
      return;
    }
    next();
  });
  app.set('view cache', true);
}

// set static, dynamic helpers
_.extend(app.locals, {
    config: config
});

app.use(errorPageMiddleware.errorPage);
// _.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

app.use(busboy({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
}));

app.use('/', router);

// error handler
if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function (err, req, res, next) {
        console.error('server 500 error:', err);
        return res.status(500).send('500 status');
    });
}

// 配置socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(config.port, function () {
    logger.log("NodeClub listening on port %d", config.port);
    logger.log("God bless love....");
    logger.log("You can debug your app with http://" + config.host + ':' + config.port);
    logger.log("");
});

io.use(function(socket, next) {
    session(socket.handshake, {}, next);
});

require('./controllers/socket_server.js').chat(io);

module.exports = app;
