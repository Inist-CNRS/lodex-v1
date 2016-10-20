/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('lodex:routes:' + basename);

module.exports = function(router, core) {

  var pages = [
    'cookies.html',
    'mention.html',
    'about.html',
    'login.html'
  ];

  pages.forEach(function(page) {
    router.route('/' + page)
    .get(function(req, res, next) {
      var locals = {
        lang : req.lang,
        url : require('url').parse(req.protocol + '://' + req.get('host') + req.originalUrl),
        query : req.query,
        print : core.config.get('print')
      };
      res.render(page, locals);
    });
  });

};
