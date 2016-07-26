/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:routes:' + basename)
  , Errors = require('../../helpers/errors.js')
  , bodyParser = require('body-parser')
  , datamodel = require('datamodel')
 ;

module.exports = function(router, core) {


  //   router.route(authorityName + '/:resourceName/:star/:columnName')
  router.route('/-/v3/setcol/:resourceName/:columnName')
  .post(bodyParser.urlencoded({ extended: true}))
  .post(function(req, res, next) {
      if (req.routeParams.resourceName === undefined || req.routeParams.columnName === undefined) {
        return next();
      }
      datamodel([core.models.mongo, core.models.postColumn])
      .apply(req)
      .then(function(locals) {
          return res.send(204);
      })
      .catch(next);
  });




}
