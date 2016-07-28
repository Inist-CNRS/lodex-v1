/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:routes:' + basename)
  , datamodel = require('datamodel')
  , express =  require('express')
  ;

module.exports = function(router, core) {

  var supportedFormats = {
    "html" : "text/html",
    "txt" : "text/plain",
    "rss" : "application/rss+xml",
    "atom" : "application/atom+xml",
    "json" : "application/json",
    "xml" : "text/xml"
  }

  //
  // Define route parameters
  //
  router.param('name', function(req, res, next, value) {
      req.templateName = value;
      next();
  });
  router.param('format', function(req, res, next, value) {
      if (supportedFormats[value]) {
        req.templateMimetype = supportedFormats[value];
      }
      next();
  });


  //
  // Define routes
  //

  router.route('/:name.:format')
  .get(function(req, res, next) {
      if (req.templateMimetype === undefined) {
        return next();
      }
      datamodel([core.models.page])
      .send(require('../helpers/render.js'))
      .apply(req, res, next);
  })

};
