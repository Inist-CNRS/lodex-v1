'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('lodex:downloaders:' + basename);
  // jsonld = require('jsonld');

module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {

    if (data._content && data._content[this.options.syntax]) {
      submit(null, data._content[this.options.syntax]);
    }
    else {
      submit(null, {});
    }
  };
};
