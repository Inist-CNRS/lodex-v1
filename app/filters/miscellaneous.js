'use strict';

module.exports = function(exec, execmap) {

  var filters = {};

  filters.hash = function(obj, args) {
    return exec(args, function(arg) {
        return require('crypto').createHash(arg || 'sha1').update(obj.toString()).digest('hex');
    }, "hash");
  };

  filters.nl2br = function(obj, args) {
    return exec(args, function(arg) {
        var sub = arg === true ? '<br/>' : '<br>';
        if (typeof obj === 'string') {
          return obj.replace(/\n/g, sub);
        }
        return obj;
    }, "nl2br");
  };

  filters.nbsp = function(obj, args) {
    return exec(args, function(arg) {
        return arg.replace(/ /, '&nbsp;');
    }, 'nbsp');
  }

  filters.or = function(obj, args) {
    return exec(args, function(arg) {
        return obj || arg;
    }, 'or');
  }

  filters.and = function(obj, args) {
    return exec(args, function(arg) {
        if (obj) {
          return obj + arg;
        }
        else {
          return '';
        }
    }, 'and');
  }

  filters.plus = function(obj, args) {
    return exec(args, function(arg) {
        return obj + arg;
    }, 'plus');
  }

  filters.is = function(obj, args) {
    return exec(args, function(arg) {
        return obj ? arg : '';
    }, 'is');
  }

  filters.true = function(obj, args) {
    return exec(args, function(arg) {
        return obj === true || obj === 'true' ? arg : '';
    }, 'true');
  }

  filters.false = function(obj, args) {
    return exec(args, function(arg) {
        return obj === false || obj === 'false' ? arg : '';
    }, 'false');
  }


  return filters;
}
