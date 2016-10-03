/*jshint node:true,laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:compute:' + basename)
  , assert = require('assert')
  , url = require('url')
  , querystring = require('querystring')
  , util = require('util')
  , events = require('events')
  , JBJ = require('jbj')
  , MongoClient = require('mongodb').MongoClient
  ;


function Compute(schema, options) {

  options = options || {};

  if (!(this instanceof Compute)) {
    return new Compute(schema, options);
  }
  events.EventEmitter.call(this);
  var self = this;
  self.options = {};
  self.options.collectionName = options.collectionName || '';
  self.options.connectionURI = options.connectionURI || process.env.MONGO_URL;
  self.options.concurrency = options.concurrency || 1;
  self.options.port = options.port || 80;

  self.schema = schema;
  self.bank = {};


}

util.inherits(Compute, events.EventEmitter);

Compute.prototype.use = function (hash, obj)
{
  var self = this;
  if (obj.map && obj.reduce && typeof obj.map === 'function' && typeof obj.reduce === 'function') {
    self.bank[hash] = obj;
  }
  return self;
};

Compute.prototype.run = function (cb)
{
  var self = this;
  debug('run', self.schema);
  if (typeof self.schema !== 'object' || self.schema === null || self.schema === undefined) {
    return cb(new Error('Invalid JBJ schema'));
  }
  if (Object.keys(self.schema).length === 0) {
    return cb();
  }
  JBJ.inject(self.schema, {}, function(err, fields) {
    debug('jbj', err, fields);
    if (err) {
      cb(err);
    }
    else {
      fields.computedDate = new Date();
      MongoClient.connect(self.options.connectionURI).then(function(db) {
        db.collection(self.options.collectionName).then(function(coll) {
          coll.insert(fields, {w:1}, cb);
          db.close();
        }).catch(cb);
    }).catch(cb);

    }
  });
};

Compute.prototype.operators = function ()
{
  var self = this;
  return Object.keys(self.bank);
};

Compute.prototype.operator = function (key)
{
  var self = this;
  if (!self.bank[key]) {
    throw new Error('Unknown key : `' + key+'`');
  }
  return self.bank[key];
};

module.exports = Compute;
