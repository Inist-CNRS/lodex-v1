'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:heartbeats:' + basename)
  ;

module.exports = function(options, core) {
  options = options || {};
  return function (heartbeat, last) {
    debug('DING');
  }
}

