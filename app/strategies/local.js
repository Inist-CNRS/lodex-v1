'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:' + basename)
  , basename = path.basename(__filename, '.js')
  , sha1 = require('sha1')
  , Strategy = require('passport-local').Strategy
  , Access = require('../helpers/access.js')
  ;


module.exports = function(options, core) {
  options = options || {};
  var acc = new Access(options.accessList || options.access || core.config.get('access') || []);

  return new Strategy(options,
    function(username, password, cb) {
      acc.findByUsername(username, function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          if (user.plain && user.plain !== password) {
            return cb(null, false);
          }
          if (user.sha1 && user.sha1 !== sha1(password)) {
            return cb(null, false);
          }
          if (user.password && user.password != password) {
            return cb(null, false);
          }
          return cb(null, user);
      });
  })
}
