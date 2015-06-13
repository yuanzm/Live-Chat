var store        = require('../common/store');

exports.upload = function (req, res, next) {
  req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      store.upload(file, {filename: filename}, function (err, result) {
        if (err) {
          return next(err);
        }
        res.json({
          success: true,
          url: result.url,
        });
      });
    });

  req.pipe(req.busboy);
};
