'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:middelwares:' + basename)
  , util = require('util')
  , config = require('../config.js')
  , jsDAV = require("jsDAV/lib/jsdav")
  ;



module.exports = function (options) {

  if (!options) {
    options = {};
  }
  jsDAV.debugMode = options.debug || false;

  return function (req, res, next) {
    jsDAV.mount({
        node: config.get('dataPath'),
        mount: "/webdav",
        server: req.app,
        standalone: false
      }
    ).exec(req, res);
  }
}

