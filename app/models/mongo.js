/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:models:' + basename)
  , MongoClient = require('mongodb').MongoClient
  ;


module.exports = function(model) {
  model
  .declare('mongoDatabaseHandle', function(req, fill) {
    MongoClient.connect(req.config.get('connectionURI')).then(function(db){
      db.collectionsIndex = function(options, callback) {
        return this.collection(req.config.get('collectionNameIndex'), options, callback);
      }
      fill(db);
    }).catch(fill);
  })
  .complete('mongoDatabaseHandle', function(req, fill) {
    if (this.mongoDatabaseHandle instanceof Error || this.mongoCursor !== undefined) {
      return fill(this.mongoDatabaseHandle);
    }
    this.mongoDatabaseHandle.close().then(fill).catch(fill);
  })
  return model;
}

