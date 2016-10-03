/*jshint node:true,laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:compute:' + basename)
  , assert = require('assert')
  , util = require('util')
  , async = require('async')
  , JBJ = require('jbj')
  , merge = require('merge')
  , MongoClient = require('mongodb').MongoClient
 ;

function Flying(schema, options) {

  options = options || {};

  if (!(this instanceof Flying)) {
    return new Flying(schema, options);
  }
  var self = this;
  self.options = {};
  self.options.collectionName = options.collectionName || '';
  self.options.connexionURI = options.connexionURI || process.env.MONGO_URL;
  self.options.concurrency = options.concurrency || 1;
  self.collname = self.options.collectionName + '_corpus';
  self.schema = schema;

}

Flying.prototype.affix = function (keys, data, callback)
{
  var self = this;
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  keys = keys.filter(function(x) { return (x !== null && x !== undefined); });

  if (keys.length === 0) {
    callback(data);
  }
  else {
    MongoClient.connect(self.options.connexionURI).then(function(db) {
        db.collection(self.collname, {strict:true}, function(err, coll) {
            if (err) {
              return callback(err);
            }
            coll.find().sort({$natural: -1}).limit(1).toArray().then(function(res) {
                var corpusFields = res[0];
                if (Array.isArray(data)) {
                  async.map(data, function(item, cb) {
                      self.process(keys, item, corpusFields, cb);
                    }, function(err, ret) {
                      callback(ret);
                  });
                }
                else if (typeof data === 'object') {
                  self.process(keys, data, corpusFields, function(err, ret) {
                      callback(ret);
                  });
                }
                else {
                  callback(data);
                }
            }).catch(function(err) {
                callback();
            });
        });
    }).catch(callback);
  }
};

Flying.prototype.process = function (keys, data, env, callback)
{
  var self = this;
  keys.forEach(function(key) {
    var input = merge (env, data);
    var stylesheet = self.schema['$'+key];
    if (stylesheet) {
      var r = JBJ.renderSync(stylesheet, input);
      if (r !== undefined) {
        data = r;
      }
    }
  });
  callback(null, data);
};

module.exports = Flying;
