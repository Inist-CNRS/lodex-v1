'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:engines:' + basename)
  , nunjucks = require('nunjucks')
  ;

var getByScheme = function(document, scheme, cover, format) {
  //debug('getByScheme(', document, ',', scheme, ',', cover);
  cover = cover || 'collection';
  format = format || 'html';
  var fieldNames = Object.keys(document);

  var wantedField = fieldNames
  .map(function (fieldName) { return document[fieldName]; })
  .filter(function (field) { return field.scheme === scheme; })
  .filter(function (field) { return field.cover === cover; });

  if (wantedField.length === 0) {
    return '';
  }
  return wantedField[0].content[format];
};

module.exports = function(options, core) {
  options = options || {};
  options.autoescape = options.autoescape || false;
  var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(options.views || 'views'),
    options
  );
  env.addFilter('getByScheme', getByScheme);
  return function (filePath, fileInput, callback) {
    env.render(filePath, fileInput, callback);
  };
};
