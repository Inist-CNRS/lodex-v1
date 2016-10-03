'use strict';
var extend = require('extend');

module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    extend(input, options);
    submit(null, input);
  }
}
