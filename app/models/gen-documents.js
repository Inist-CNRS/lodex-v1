/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:models:' + basename)
  , url = require('url')
  , Loader = require('castor-load')
  , shortid = require('shortid')
  ;

module.exports = function(model) {

  model
  .declare('loaderOptions', function(req, fill) {
      fill({
          "collectionName" : req.body.range,
          "connexionURI" : req.config.get('connexionURI'),
          "concurrency" : req.config.get('concurrency'),
          "delay" : req.config.get('delay'),
          "maxFileSize" : req.config.get('maxFileSize'),
          "writeConcern" : req.config.get('writeConcern'),
          "ignore" : req.config.get('filesToIgnore'),
          "watch" : false
      });
  })
  .declare('documentURL', function(req, fill) {
      fill({
        protocol: "http",
        hostname: "127.0.0.1",
        port: req.config.get('port'),
        query: {
          plain : req.body.size
        }
      })
  })
  .declare('arkOptions', function(req, fill) {
      fill({
          range: req.body.range,
          authority: req.config.get('NAAN'),
          size: req.body.size
      });
  })
  .append('listName', function(req, fill) {
      var self = this
        , ldr
        , listname = shortid.generate();
      self.documentURL.pathname = "/-/v3/echo/" + listname + ".list";
      debug('listname', listname);
      ldr = new Loader(__dirname, self.loaderOptions);
      debug('listname', self.arkOptions);
      ldr.use('**/*', require('../loaders/ark.js')(self.arkOptions));
      ldr.use('**/*', require('../loaders/wid.js')());
      ldr.use('**/*', require('../loaders/name.js')());
      debug('push',  url.format(self.documentURL));
      ldr.push(url.format(self.documentURL));
      fill(listname);
  })

  return model;

}
