/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('castor:routes:' + basename);
// var datamodel = require('datamodel');
// var upload = require('./v3/upload.js');
// var load = require('./v3/load.js');
var setcol = require('./v3/setcol.js');
var settab = require('./v3/settab.js');
var setroot = require('./v3/setroot.js');


module.exports = function(router, core) {

  var supportedFormats = {
    html : 'text/html',
    txt : 'text/plain',
    rss : 'application/rss+xml',
    atom : 'application/atom+xml',
    json : 'application/json',
    xml : 'text/xml'
  };

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


  //upload(router, core);
  //load(router, core);
  setcol(router, core);
  settab(router, core);
  setroot(router, core);

  return router;
};
