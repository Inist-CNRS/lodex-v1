/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:routes:' + basename)
  , mqs = require('mongodb-querystring')
  ;

module.exports = function(router) {

  router.route('/-/echo/:basename.:extension')
  .get(function(req, res, next) {
    res.send(mqs.parse(req.query));
  });

}
