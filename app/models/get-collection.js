/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:models:' + basename)
  ;

module.exports = function(model) {
  model
    .declare('defaultDescription', function(req, fill) {
    fill({
      "fid": "__change__me__",       // pour être compatible castor-load
      "number": 0,          // pour être compatible castor-load
      "state": "inserted",  // pour être compatible castor-load
      "_wid": "__change__me__",
      "_label": 'Default Title',
      "_text": "Default description",
      "_hash": null,
      "_template": null,
      "_rootSince": new Date(Date.now())
    });
  })
  .append('collection', function(req, fill) {
      var Errors = req.core.Errors;
      var self = this;
      if (self.mongoDatabaseHandle instanceof Error) {
        return fill();
      }
      self.mongoDatabaseHandle.collectionsIndex().findOne({
          "_wid" : req.routeParams.resourceName
      }).then(function(doc) {
        if (doc === null) {
            self.defaultDescription.fid = req.routeParams.resourceName;
            self.defaultDescription._wid = req.routeParams.resourceName;
            if (req.routeParams.resourceName === 'index') {
              self.defaultDescription._label = 'Dataset';
            }
            else {
              self.defaultDescription._label = 'Collection ' + req.routeParams.resourceName;
            }
            fill(self.defaultDescription);
          }
          else {
            fill(doc);
          }
      }).catch(fill);
    })
    .append('dataset', function(req, fill) {
      var Errors = req.core.Errors;
      var self = this;
      if (self.mongoDatabaseHandle instanceof Error) {
        return fill();
      }
      self.mongoDatabaseHandle.collectionsIndex().findOne({
          "_wid" : "index"
      }).then(function(doc) {
        if (doc === null) {
            self.defaultDescription.fid = 'index';
            self.defaultDescription._wid = 'index';
            self.defaultDescription._label = 'Dataset';
            fill(self.defaultDescription);
          }
          else {
            fill(doc);
          }
      }).catch(fill);
    })
    .append('isRoot', function(req, fill) {
      var Errors = req.core.Errors;
      var self = this;
      if (self.mongoDatabaseHandle instanceof Error) {
        return fill();
      }
      self.mongoDatabaseHandle.collectionsIndex()
      .find()
      .sort({'_rootSince': -1})
      .limit(1)
      .toArray()
      .then(function(docs) {
        fill(req.routeParams.resourceName === docs[0]._wid)
      })
      .catch(fill);
  })
  .complete('collection', function(req, fill) {
      var self = this;
      self.collection._isRoot = self.isRoot === true;
      self.collection._dataset = self.dataset;
      Object.keys(self.collection).filter(function(key) { return key[0] !== '_' }).forEach(function(key) { delete self.collection[key] });
      delete self.collection._id;
      fill(self.collection);
  })



  return model;
}



