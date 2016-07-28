/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:routes:' + basename)
  , bodyParser = require('body-parser')

module.exports = function(router, core) {

  router.route('/-/setroot')
  .post(bodyParser.json()) // for this.$http.post (vue-resource)
  .post(bodyParser.urlencoded({ extended: true})) // for $.ajax (jquery)
  .post(function(req, res, next) {
      core.connect().then(function(db) {
          db.collection(core.config.get('collectionsIndexName'), function(err, coll) {
              debug('body', req.body);
              coll.updateMany({}, {
                  $set: {
                    _root : false
                  }
                }, {
                  w : 1,
                  multi : true
              }).then(function(res1) {
                  debug(res1.modifiedCount + ' / ' + res1.matchedCount);
                  coll.updateOne({
                      _wid: req.body.origin
                    },
                    {
                      $set: {
                        _root : true
                      }
                    }
                  ).then(function(res2) {
                      debug(res2.modifiedCount + ' / ' + res2.matchedCount);
                      res.sendStatus(204);
                  }).catch(next);
              }).catch(next);
          });
      }).catch(next);
  })
}
