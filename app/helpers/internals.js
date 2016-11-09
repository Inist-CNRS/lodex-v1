'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  , util = require('util')
  , base = require('../helpers/base.js')
  ;

module.exports = function (core) {

  var func = {};

  func.getPublicCollection = function getPublicCollection (origin, cb) {
    var collectionName = origin['_wid'] + '_P_' +
    base(origin['_rootSince'].getTime() - 1451606400000,
      '0123456789ABCDEFEFGHIJKLMNOPQRSTUVWXYZ');
    core.connect().then(function(db) {
      db.collection(collectionName).count().then(function(nbd) {
        if (nbd > 1) {
          return cb(null, collectionName);
        }
        //
        // On renvoit une erreur plutot- que d'attendre la fin du chargement
        //
        // eslint-disable-next-line callback-return
        cb(new core.Errors.Unavailable('First start : loading data...'));

        var reqopt = {
          internal : true,
          body : {
            url : 'http://127.0.0.1:' + core.config.get('port') + '/' + origin['_wid'] + '/*.jdx'
          }
        };
        core.agent.post('/' + collectionName, reqopt).then(function(reqout) {
          core.agent.get('/' + collectionName + '/$keys?field=_columns',
            { internal:true, json:true })
          .then(function(columns) {
            var indexes = Object.keys(columns).map(function(k) { return columns[k]['_id']; })
            .map(function(columnName) {
              var idx = {};
              idx.key = {};
              idx.key['_columns.' + columnName + '.content'] = 1;
              idx.background = true;
              return idx;
            });
            db.collection(collectionName).createIndexes(indexes).then(function(r) {
              debug('Initialization completed', indexes.length + ' indexes created.');
            }).catch(function(e) {
              debug('initialization ended with : ', e);
            });
            db.close();
          }).catch(cb);
        }).catch(cb);

      }).catch(cb);
    }).catch(cb);
  };

  func.getMasterCollection = function getMasterCollection(cb) {
    core.connect().then(function(db) {
      db.collection(core.config.get('collectionNameIndex'), function(err, coll) {
        if (err) {
          return cb(err);
        }
        coll.find()
        .sort({ _rootSince: -1 })
        .limit(1)
        .toArray()
        .then(function(docs) {
          db.close();
          if (docs === null) {
            return cb(new core.Errors.TableNotFound('The root table does not exist.'));
          }
          debug('Root table is', docs[0]['_wid'], 'with', docs[0]['_rootSince']);
          func.getPublicCollection(docs[0], cb);
        })
        .catch(function(e) {
          db.close();
          cb(e);
        });
      });
    }).catch(cb);
  };

  func.getWidByField = function getWidByField(collname, key, value, cb) {
    core.connect().then(function(db) {
      db.collection(collname, function(err, coll) {
        var qry = {};
        if (err) {
          return cb(err);
        }
        qry[key] = value;
        coll.find(qry)
        .limit(1)
        .toArray()
        .then(function(docs) {
          db.close();
          if (docs === null) {
            return cb(new core.Errors.ResourceNotFound('key/value returns no wid.'));
          }
          cb(null, docs[0]['_wid']);
        })
        .catch(function(e) {
          db.close();
          cb(e);
        });
      });
    }).catch(cb);
  };


  return func;
};
