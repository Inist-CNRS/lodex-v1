'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:engines:' + basename)
  , fs = require('fs')
  ;

module.exports = function(options, core) {
  options = options || {};
  return function (filePath, fileInput, callback) {
    fs.readFile(filePath, callback);
  }
}

