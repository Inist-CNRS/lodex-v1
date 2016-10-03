'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:engines:' + basename)
  , nunjucks = require('nunjucks')
  ;

module.exports = function(options, core) {
  options = options || {};
  options.autoescape = options.autoescape || false;
  var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(options.views || 'views'),
    options
  );
  return function (filePath, fileInput, callback) {
    env.render(filePath, fileInput, callback);
  }
}
