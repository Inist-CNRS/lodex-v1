/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , bodyParser = require('body-parser')

module.exports = function(router, core) {

  router.route('/-/setroot')
  .post(bodyParser.urlencoded({ extended: true}))
  .post(function(req, res, next) {
      core.connect().then(function(db) {
          db.collection(core.config.get('collectionsIndexName'), function(err, coll) {
              console.log('coll', coll.update);
              coll.updateMany({}, {
                  $set: {
                    _root : false
                  }
                }, {
                  w : 1,
                  multi : true
              }).then(function(res1) {
                  console.log(res1.modifiedCount + ' / ' + res1.matchedCount);
                  coll.updateOne({
                      _wid: req.body.origin
                    },
                    {
                      $set: {
                        _root : true
                      }
                    }
                  ).then(function(res2) {
                      console.log(res2.modifiedCount + ' / ' + res2.matchedCount);
                      res.sendStatus(204);
                  }).catch(next);
              }).catch(next);
          });
      }).catch(next);
  })
}
