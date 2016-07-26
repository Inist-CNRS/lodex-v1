/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:routes:' + basename)
  , express = require('express')
  , assert = require('assert')
  , datamodel = require('datamodel')
  , Errors = require('../helpers/errors.js')
  , cors = require('cors')
  , slashes = require("connect-slashes")
  ;


module.exports = function(router, core) {

  var prefixURL = core.config.get('prefixURL');
  var prefixKEY = core.config.get('prefixKEY');

  //
  // Define route parameters
  //
  router.param('resourceName', function(req, res, next, value) {
    req.routeParams.resourceName = value;
    next();
  });

  router.route(prefixURL + '/:resourceName')
  .all(cors())
  .all(slashes())
  .get(function(req, res, next) {
    debug('get /:resourceName', req.routeParams);
    if (req.routeParams.resourceName === undefined) {
      return next();
    }
    datamodel([core.models.page, core.models.mongo, core.models.getTable])
    .apply(req)
    .then(function(locals) {
      return res.render("admin.html", locals);
    })
    .catch(next);
  });


  return router;
};
