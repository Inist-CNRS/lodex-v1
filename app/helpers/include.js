/*jshint node:true, laxcomma:true */
"use strict";

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:' + basename)
  , util = require('util')
  , assert = require('assert')
  , Errors = require('../helpers/errors.js')
  ;

module.exports = function(basedirs, modname, req) {
  debug(basedirs, modname);
  req = req === false ? false : true;
  if (modname === undefined) {
    modname = basedirs;
    basedirs = [];
  }
  assert(typeof modname, 'string');
  basedirs = basedirs
  .filter(function (basedir) {
    return (typeof basedir === 'string');
  })
  .map(function(basedir) {
    return path.join(basedir, modname);
  });
  basedirs.push(modname);
  var module = basedirs.reduce(function(prev, modir) {
    if (prev !== undefined) {
      return prev;
    }
    try {
      var m = require.resolve(modir);
      return m;
    }
    catch (e) {
      if (e.code && e.code === 'MODULE_NOT_FOUND') {
        return undefined;
      }
      else {
        throw e;
      }
    }
  }, undefined);

  if (module === undefined) {
    debug('Module failed.', module)
    throw new Errors.BadConfig(util.format('Unknown (or Missing or Error in) Module `%s` (%s)', modname, basedirs.join(', ')));
  }
  else {
    debug('Module found.', module)
    if (req) {
      return require(module);
    }
    else {
      return module;
    }
  }
};

