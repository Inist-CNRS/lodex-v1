/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:models:' + basename)
  ;


module.exports = function(model) {
  model
  .declare('indexDescription', function(req, fill) {
    var index = {
      // @todo Idéalement il faudrait inserer ce document avec castor-load
      fid: req.config.get('collectionNameIndex'),       // pour être compatible castor-load
      number: 0,          // pour être compatible castor-load
      state: 'inserted',  // pour être compatible castor-load
      _wid: 'index',
      _label: 'Dataset',
      _text: 'The dataset keeps global inforamtion',
      _rootSince: new Date(
        req.config.get('defaultRootCollection') === req.config.get('collectionNameIndex')
        ? Date.now() : 0),
      _updated: new Date(Date.now())
    };
    fill(index);
  })
  .declare('hotfolderDescription', function(req, fill) {
    var index;
    if (req.config.has('dataPath')) {
      index = {
        // @todo Idéalement il faudrait inserer ce document avec castor-load
        fid: req.config.get('collectionNameHotFolder'),       // pour être compatible castor-load
        number: 0,          // pour être compatible castor-load
        state: 'inserted',  // pour être compatible castor-load
        _wid: req.config.get('collectionNameHotFolder'),
        _label: 'Hotfolder',
        _text: 'The hot folder is continuously monitored, and when files are copied or dropped ' +
               'into it, they are automatically processed',
        _rootSince: new Date(
          req.config.get('defaultRootCollection') === req.config.get('collectionNameHotFolder')
          ? Date.now() : 0),
        _updated: new Date(Date.now())
      };
    }
    fill(index);
  })
  .prepend('initState', function(req, fill) {
    // eslint-disable-next-line no-invalid-this
    var self = this;
    if (self.mongoDatabaseHandle instanceof Error) {
      return fill();
    }
    self.mongoDatabaseHandle.collectionsIndex({ strict:true }, function(err, coll) {
      if (err) {
        self.mongoDatabaseHandle.collectionsIndex(function(err, newcoll) {
          if (err) { return fill(err); }
          var descs = [self.indexDescription];
          if (req.config.has('dataPath')) {
            descs.push(self.hotfolderDescription);
          }
          newcoll.insertMany(descs).then(function() {
            self.mongoDatabaseHandle.createIndex(req.config.get('collectionNameIndex'),
              { _wid:1 },
              { unique:true, background:false, w:1 }
            ).then(function() {
              fill(true);
            }).catch(fill);
          }).catch(fill);
        });
      }
      else {
        fill(false);
      }
    });
  })
  .prepend('cleanUp', function(req, fill) {
    // eslint-disable-next-line no-invalid-this
    var self = this;
    if (self.mongoDatabaseHandle instanceof Error) {
      return fill();
    }
    if (req.config.get('cleanAtStartup') === true) {
      self.mongoDatabaseHandle.listCollections({}).toArray().then(function(names) {
        names.map(function(cur) {
          return cur.name;
        }).filter(function(key) {
          return key.search(/_P_/) !== -1 || key.search(/_R_/) !== -1;
        }).forEach(function(key) {
          self.mongoDatabaseHandle.collection(key).drop().then(function(reply) {
            debug('CleanUp : Success', key);
          }).catch(function(reply) {
            debug('CleanUp : Fail', key);
          });
        });
      })
      .catch(fill);
    }
    else {
      fill();
    }
  });

  return model;
};

