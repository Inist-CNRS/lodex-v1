'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  ;

module.exports = function(config, core) {
  config = config || {};
  return function (data, submit) {
    var self = this;
    data._config = config;
    submit(null, data);
  }
}

