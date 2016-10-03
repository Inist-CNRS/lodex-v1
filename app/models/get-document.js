/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:models:' + basename)
  ;

module.exports = function(model) {
  if (model === undefined) {
    model = require('datamodel')();
  }
  model
  .declare('collectionName', function(req, fill) {
    fill(req.routeParams.resourceName);
  })
  .prepend('mongoQuery', function(req, fill) {
      var q = {};
      q._wid = req.routeParams.documentName;
      q.state = {
        $nin: [ "deleted", "hidden" ]
      };
      debug('mongoQuery on '+this.collectionName, q);
      fill(q);
  })
  .append('mongoCursor', function(req, fill) {
      if (this.mongoDatabaseHandle instanceof Error) {
        return fill();
      }
      fill(this.mongoDatabaseHandle.collection(this.collectionName).find(this.mongoQuery).limit(1));
  })


  return model;
}



