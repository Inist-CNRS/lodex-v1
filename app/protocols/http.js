'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:protocols:' + basename)
  ;

module.exports = function(options, core) {
  var agent = core.agent;
  options = options || {};
  return function (urlObj, callback) {
    agent.get(urlObj).then(function (body) {
      debug(urlObj.href, body);
      callback(null, body);
    })
    .catch(function (reason) {
      callback(reason.error);
    });
  };
};
