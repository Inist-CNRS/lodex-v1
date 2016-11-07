'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('lodex:' + basename);
var assert = require('assert');

module.exports = function(exec, execmap) {
  var filters = {};

  filters.getURIByField = function getURIByField(obj, args, next) {
    return exec(args, function(args) {
      debug('getURIByField(', obj, ',', args, ')');
      assert(typeof obj === 'string');
      next(null, obj.concat('X'));
    }, 'getURIByField');
  };

  return filters;
};
