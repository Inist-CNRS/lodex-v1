'use strict';

var path         = require('path');
var basename     = path.basename(__filename, '.js')
var debug        = require('debug')('castor:' + basename)
var process      = require('process');
var request      = require('supertest');
var starter      = require('../starter.js');

/**
 * Test https://github.com/castorjs/castor-core/issues/21
 *
 * This bug was due the presence of a connectionURI within
 * castor.config.js
 *
 * To make app1 should return the number of films in data fail,
 * create a test/castor.config.js containing:
 *
 *  module.exports = {
 *    connectionURI: 'mongodb://localhost:27017/bug21'
 *  };
 *
 */


/**
 * query /-/v3/status.json until the initial synchronisation is done
 *
 * @param  {Object}   server server to query
 * @param  {Function} cb     Callback to call (err)
 * @return {void}
 */
var untilSync = function untilSync (server, cb) {
  // delay between two queries, in ms
  var delay = 1000;

  request(server)
  .get('/-/v3/status.json')
  .end(function(err, res) {
    if (err) {
      return cb(err);
    }

    var status = JSON.parse(res.res.text);
    if (status.hotfolder.first.syncOver) {
      return cb();
    }
    else {
      setTimeout(untilSync, delay, server, cb)
    }
  });
};


// Reproduce issue #21: castor 3.12 side by side applications use the same database
describe('Side by side', function () {

  var server1 = null;
  var server2 = null;

  before(function(done) {
    // Synchronisation may take time - you may increase the value (ms)
    this.timeout(10000);

    // Launch data
    process.chdir(__dirname);

    starter(function(config, start) {
      config.set('dataPath', path.join(__dirname, 'data'));
      var routes = config.get('routes');
      routes.push('status.js');
      config.set('routes', routes);
      // Reduce the heartrate to be ready quicker (in milliseconds)
      config.set('heartrate',100);

      start(function(err, serv) {
        if (err) { return done(err); }
        server1 = serv;
        debug('server1',server1._connectionKey);

        untilSync(server1, function (err) {
          if (err) { return done(err); }

          // Launch data 2
          starter(function(config, start) {
            config.set('dataPath', path.join(__dirname, 'data2'));

            start(function(err, serv) {
              // Because some module removes console.log
              console.log = console.info;
              if (err) { return done(err); }
              server2 = serv;
              debug('server2',server2._connectionKey);
              untilSync(server2, done);
            });
          });

        });
      });
    })

  });

  //////////////////////////////////

  describe('app1', function () {

    it('should return the number of films in data', function (done) {
      debug('app1, test');
      request(server1)
        .get('/hotfolder/$count')
        .expect(200)
        .expect('[{"_id":"_wid","value":29}]', done);
      debug('app1, fin');
    });

  });

  describe('app2', function () {

    it('should return the number of films in data2', function (done) {
      debug('app2, test');
      request(server2)
        .get('/hotfolder/$count')
        .expect(200)
        .expect('[{"_id":"_wid","value":12}]', done);
      debug('app2, fin');
    });

  });

  //////////////////////////////////
  after(function(done) {
    server1.close(function(err) {
      if (err) { return done(err); }
      debug('server 1 closed');
      server2.close(function(err) {
        debug('server 2 closed');
        done(err);
      });
    });
  });

});
