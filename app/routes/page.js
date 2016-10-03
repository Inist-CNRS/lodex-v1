/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('lodex:routes:' + basename);
var datamodel = require('datamodel');
// var express =  require('express');
var render = require('../helpers/render.js');

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
      req.templateMimetype = supportedFormats[value];
    }
    next();
  });


  //
  // Define routes
  //

  router.route('/:name.:format')
  .get(function(req, res, next) {
    if (req.templateMimetype === undefined) {
      return next();
    }
    datamodel([core.models.page])
    .send(render)
    .apply(req, res, next);
  });

};
