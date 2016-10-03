'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:middlewares:' + basename)
  , auth = require('basic-auth')
  ;


module.exports = function (options) {
  options = options || {};
  return function (req, res, next) {
    var credentials = auth(req)
    if (credentials && credentials.name === 'admin') {
      req.user = credentials;
    }
    next();
  }
}
