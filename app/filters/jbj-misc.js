'use strict';
var truncate = require('lodash.truncate');
var omit = require('object.omit');

module.exports = function(exec, execmap) {

  var filters = {};

  filters.truncateField = function(obj, args) {
    return exec(args, function(arg) {
      var opt = {};
      if (typeof arg !== 'object') {
        arg = {
          length: Number(arg)
        };
      }
      opt.length = arg.length || 30;
      opt.omission = arg.omission || '…';
      opt.separator = arg.separator || ' ';
      return truncate(obj.toString(), opt);
    }, 'truncateField');
  };

  filters.values = function(obj, args) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  };

  filters.omit = function(obj, args) {
    if (typeof args === 'string') {
      args = args.split(',');
    }
    return omit(obj, args);
  };

  return filters;
};
