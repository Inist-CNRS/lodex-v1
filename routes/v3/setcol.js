/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('castor:routes:' + basename);
var bodyParser = require('body-parser');
var datamodel = require('datamodel');

module.exports = function(router, core) {

  //   router.route(authorityName + '/:resourceName/:star/:columnName')
  router.route('/-/v3/setcol/:resourceName/:columnName')
  .post(bodyParser.urlencoded({ extended: true}))
  .post(function(req, res, next) {
    if (req.routeParams.resourceName === undefined || req.routeParams.columnName === undefined) {
      return next();
    }
    datamodel([core.models.mongo, core.models.postColumn])
    .apply(req)
    .then(function(locals) {
      return res.send(204);
    })
    .catch(next);
  });

};
