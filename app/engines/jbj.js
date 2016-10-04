'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:engines:' + basename)
  , JBJ = require('jbj')
  ;

module.exports = function(options, core) {
  options = options || {};
  return JBJ.renderFile;
};
