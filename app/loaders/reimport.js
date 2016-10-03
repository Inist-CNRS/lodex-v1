'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , path = require('path')
  , debug = require('debug')('castor:loaders:' + basename)
  ;

module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    Object.keys(input.content.json).filter(function(key) {
      return key[0] === '_'
    }).forEach(function(key) {
      input[key] = input.content.json[key];
    });
    delete input.content.json._content
    delete input.content
    submit(null, input);
  }
}
