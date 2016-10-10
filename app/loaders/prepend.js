'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:loaders:' + basename)
  , shorthash = require('short-hash')
  ;
module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    input.name = path
    .basename(input.location, path.extname(input.location))
    .replace(/[_\-\.]+/g, ' ');
    input.identifier = shorthash(input.fid + input.number)

    submit(null, input);
  };
};
