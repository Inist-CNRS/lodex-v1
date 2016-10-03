'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , path = require('path')
  ;
module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    input.name = path.basename(input.location, path.extname(input.location)).replace(/[\_\-\.]+/g, ' ');

    submit(null, input);
  }
}
