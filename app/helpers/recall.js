'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  , extend = require('extend')
  , util = require('util')
  , url = require('url')
  , http = require('http')
  , Stream = require('stream').Stream
  ;

module.exports = function(urlObjGlobal) {
  // @see https://nodejs.org/api/url.html#url_url_format_urlobj
  return function (urlObjLocal, callback) {
    var urlObj = {}
      , proxy
      , req
      , buf = '';
    if (urlObjLocal instanceof Stream) {
      proxy = urlObjLocal;
      urlObjLocal = {};
    }
    if (urlObjGlobal !== undefined) {
      extend(urlObj, urlObjGlobal, urlObjLocal);
    }
    urlObj.protocol = 'http:';
    urlObj.hostname = '127.0.0.1';

    try {
      if (proxy === undefined) {
        debug('recall(stream)', url.format(urlObj), urlObj);
        req = http.get(url.format(urlObj), function(res) {
          if (res.statusCode !== 200) {
            return callback(new Error('HTTP Error ' + res.statusCode));
          }
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
            buf += chunk.toString();
          });
          res.on('error', callback);
          res.on('end', function() {
            callback(null, JSON.parse(buf));
          });
        });
        req.on('error', callback);
      }
      else {
        debug('recall(get)', url.format(urlObj));
        req = http.get(url.format(urlObj), function(res) {
          //debug('headers', res.headers);
          delete res.headers['set-cookie'];
          proxy.writeHead(res.statusCode, res.headers);
          res.pipe(proxy);
        });
        req.on('error', callback);
      }
    }
    catch (e) {
      return callback(e);
    }
  };
};
