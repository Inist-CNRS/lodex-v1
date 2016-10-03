/*jshint node:true,laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:helpers:' + basename)
  , assert = require('assert')
  , util = require('util')
  , events = require('events')
  , minimatch = require("minimatch")
  , async = require('async')
  ;

function ACL(schema, options) {

  options = options || {};

  if (!(this instanceof ACL)) {
    return new ACL(schema, options);
  }
  events.EventEmitter.call(this);
  var self = this;
  self.options = {};
  self.bank = [];
}

util.inherits(ACL, events.EventEmitter);

ACL.prototype.use = function (hash, func)
{
  var self = this;
  self.bank.push([hash, func]);
  return self;
};


ACL.prototype.route = function() {
  var self = this;
  return function (req, res, next) {
    var Errors = req.core.Errors;
    var method = req.method.toLocaleUpperCase();
    var path = req.path;
    var match = function(x) {
      var pattern = x[0]
      var i = pattern.indexOf(' ');
      if (i === -1)  {
        return false;
      }
      if (pattern.substring(0, i).toLocaleUpperCase() === method || pattern.substring(0, i) === '*') {
        return minimatch(path, pattern.substring(i + 1));
      }
      else {
        return false;
      }

    }
    var get = function(x) {
      return function(done) {
        x[1](req, done)
      };
    }
    var check = function(prev, cur) {
      if (cur === true) {
        return cur;
      }
      else {
        return prev;
      }
    }

    var list = self.bank.filter(match).map(get);

    async.parallel(list, function(err, results) {
        results = results.filter(function(x) {return typeof x === 'boolean'})
        if (err) {
          debug('access on error for ', path);
          return next(err);
        }
        if (results.length === 0) {
          debug('access ignored for ', path);
          return next()
        }
        if (results.reduce(check, false) === true) {
          debug('access allowed for ', path, err, results);
          next();
        }
        else {
          debug('access denied for ', path, err, results);
          next(new Errors.Forbidden('restricted access'));
        }
    });
  }
}



module.exports = ACL;
