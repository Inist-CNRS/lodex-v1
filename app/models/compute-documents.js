/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:models:' + basename)
  , JBJ = require('jbj')
  , mqs = require('mongodb-querystring')
  , sha1 = function(str) {
      return require('crypto').createHash('sha1').update(str).digest('hex')
    }
  ;

module.exports = function(model) {
  model
  .prepend('collectionName', function(req, fill) {
    fill(req.routeParams.resourceName)
  })
  .declare('mongoQuery', function(req, fill) {
    var q = mqs.create(req.query).$query();
    if (req.routeParams.resourceName === req.core.config.get('collectionNameIndex')) {
      q = { _wid: { $ne: req.core.config.get('collectionNameIndex') } }
    }
    q.state = {
      $nin: [ "deleted", "hidden" ]
    };
    debug('mongoQuery', q);
    fill(q);
  })
  .declare('field', function(req, fill) {
   if (Array.isArray(req.query.field)) {
      fill(req.query.field);
    }
    else if (req.query.field) {
      fill([req.query.field]);
    }
    else {
      fill(['_wid']);
    }
  })
  .append('mongoCursor', function(req, fill) {
    var self = this;
    if (self.mongoDatabaseHandle instanceof Error || self.collectionName instanceof Error) {
      return fill();
    }
    var collectionName = self.collectionName.concat('_R_').concat(sha1(JSON.stringify(self.mongoQuery)));
    debug('collections', collectionName, self.collectionName);
    var opts = {
      query: self.mongoQuery,
      out: {
        replace: collectionName
      },
      scope: {
        exp : self.field
      }
    }
    if (req.routeParams.operator.finalize && typeof req.routeParams.operator.finalize === 'function') {
      opts.finalize = req.routeParams.operator.finalize;
    }
    //debug('run', 'db.getCollection(\'' + self.collectionName + '\').mapReduce(', req.routeParams.operator.map.toString(), ',', req.routeParams.operator.reduce, ',', opts,')');
    self.mongoDatabaseHandle.collection(self.collectionName).mapReduce(req.routeParams.operator.map, req.routeParams.operator.reduce, opts).then(function(collection) {
      var q = mqs.create(req.query);
      var mongoSort = q.$orderby();
      var mongoLimit = q.$limit(0);
      var mongoOffset = q.$offset(0);
      var mongoCursor =  collection
      .find()
      .sort(mongoSort)
      .limit(Number.isNaN(mongoLimit) ? 25 : mongoLimit)
      .skip(Number.isNaN(mongoOffset) ? 0 : mongoOffset);
      debug('mongoCursor on `' + collectionName + '`', self.mongoQuery, 'order by', mongoSort, 'limit', mongoLimit, 'skip', mongoOffset);
      fill(mongoCursor);
    })
    .catch(fill);
  })
  return model;
}



