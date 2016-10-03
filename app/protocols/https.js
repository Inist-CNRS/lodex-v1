'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:protocols:' + basename)
  ;

module.exports = function(options, core) {
  var agent = core.agent;
  options = options || {};
  return function (urlObj, callback) {
    agent.get(urlObj, {}, function(error, response, body) {
      if (response && response.statusCode !== 200) {
        body = undefined;
      }
      callback(error, body);
    });
  };
}
