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
        req.templateName = req.templateName + '.' + value;
        req.templateMimetype = supportedFormats[value];
      }
      next();
  });
  router.param('resourceName', function(req, res, next, value) {
      req.routeParams.resourceName = value;
      next();
  });
  router.param('columnName', function(req, res, next, value) {
      req.routeParams.columnName = value;
      next();
  });


  require('./v3/upload.js')(router, core);
  require('./v3/load.js')(router, core);
  require('./v3/setcol.js')(router, core);
  require('./v3/settab.js')(router, core);
  require('./v3/setroot.js')(router, core);

  return router;
};
