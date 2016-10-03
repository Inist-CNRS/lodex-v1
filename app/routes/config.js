/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:routes:' + basename)
  ;

module.exports = function(router) {

  router.route('/-/config.json')
  .get(function (req, res) {
      res.set('Content-Type', 'text/javascript');
      res.jsonp(req.config.expose());
  });

}
