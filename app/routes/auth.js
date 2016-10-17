/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:routes:' + basename)
  , bodyParser = require('body-parser')
  , url = require('url')
  ;


module.exports = function(router, core) {

  var passport = core.passport;

  router.route('/-/login')
  .post(bodyParser.urlencoded({ extended: true }))
  .post(function (req, res, next) {
    debug('req.body', req.body);
    next();
  })
  .post(passport.authenticate('local', { failureRedirect: '/login.html' }),
  function(req, res) {
    if (req.body && req.body.url) {
      var to = url.parse(req.body.url);
      delete to['port'];
      delete to['host'];
      delete to['hostname'];
      delete to['slashes'];
      delete to['protocol'];
      debug('req.to', to);
      res.redirect(url.format(to));
    }
    else {
      res.redirect('/');
    }
  });


  router.route('/-/logout')
  .get(function (req, res) {
    req.logout();
    res.redirect('/');
  });

};
