/* jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:models:' + basename)
  , mqs = require('mongodb-querystring')
  ;

module.exports = function(model) {
  if (model === undefined) {
    model = require('datamodel')();
  }
  model
  .declare('collectionName', function(req, fill) {
    fill(req.routeParams.resourceName);
  })
  .declare('mongoQuery', function(req, fill) {
    var q = mqs.create(req.query).$query();
    if (req.routeParams.resourceName === req.core.config.get('collectionNameIndex')) {
      if (!q._wid) {
        q._wid = {
          $ne: req.core.config.get('collectionNameIndex')
        }
      }
    }
    q.state = {
      $nin: [ "deleted", "hidden" ]
    };
    debug('mongoQuery', q);
    fill(q);
  })
  .append('mongoCursor', function(req, fill) {
      if (this.mongoDatabaseHandle instanceof Error) {
        return fill();
      }
      var q = mqs.create(req.query);
      var mongoSort = q.$orderby();
      var mongoLimit = q.$limit(0);
      var mongoOffset = q.$offset(0);
      var mongoCursor = this.mongoDatabaseHandle
      .collection(this.collectionName)
      .find(this.mongoQuery)
      .sort(mongoSort)
      .limit(Number.isNaN(mongoLimit) ? 25 : mongoLimit)
      .skip(Number.isNaN(mongoOffset) ? 0 : mongoOffset);
      debug('mongoCursor on `' + this.collectionName + '`', this.mongoQuery, 'order by', mongoSort, 'limit', mongoLimit, 'skip', mongoOffset);
      fill(mongoCursor);
  })


  return model;
}



