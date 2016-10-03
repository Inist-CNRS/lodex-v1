/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('lodex:routes:' + basename);

module.exports = function(router, core) {

  //
  // Define routes
  //

  router.route('/cookies.html')
  .get(function(req, res, next) {
    var locals = {
      print : core.config.get('print')
    }
    res.render('cookies.html', locals);
  });


  router.route('/mention.html')
  .get(function(req, res, next) {
    var locals = {
      print : core.config.get('print')
    }
    res.render('mention.html', locals);
  });


  router.route('/about.html')
  .get(function(req, res, next) {
    var locals = {
      print : core.config.get('print')
    }
    res.render('about.html', locals);
  });


};
