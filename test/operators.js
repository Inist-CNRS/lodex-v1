'use strict';

var path         = require('path');
var basename     = path.basename(__filename, '.js')
var debug        = require('debug')('castor:' + basename)
var assert       = require('assert');
var request      = require('supertest');


/**
 * query /-/v3/status.json until the initial synchronisation is done
 *
 * @param  {Object}   server server to query
 * @param  {Function} cb     Callback to call (err)
 */
var untilSync = function untilSync (server, cb) {
  // delay between two queries, in ms
  var delay = 1000;

  request(server)
  .get('/-/v3/status.json')
  .end(function(err, res) {
    if (err) { cb(err); }

    var status = JSON.parse(res.res.text);
    if (status.hotfolder.first.syncOver) {
      cb();
    }
    else {
      setTimeout(untilSync, delay, server, cb)
    }
  });
};

describe('Operators', function () {

  var server = null;

  before(function(done) {
    // Synchronisation may take time - you may increase the value (ms)
    this.timeout(10000);

    require('../starter.js')(function(config, start) {
      config.set('dataPath', path.join(__dirname, 'data'));
      var routes = config.get('routes');
      routes.push('status.js');
      config.set('routes', routes);
      // Reduce the heartrate to be ready quicker (in milliseconds)
      config.set('heartrate',100);

      start(function(err, serv) {
        server = serv;
        // Because some module removes console.log
        console.log = console.info;

        untilSync(server, done);
      });
    })

  });

  //////////////////////////////////

  describe('count', function () {

    it('should work', function () {
      assert(true);
    });

    it('should return results', function (done) {
      request(server)
        .get('/hotfolder/$count')
        .expect(200)
        .expect('[{"_id":"_wid","value":29}]', done);
    });

  });

  //////////////////////////////////
  after(function(done) {
    server.close(function(err) {
      done(err);
    });
  });

});
