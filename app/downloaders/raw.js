'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  ;

module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {
    var self = this;
    submit(null, data);
  }
}

