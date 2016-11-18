'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  , util = require('util')
  , qs = require('qs')
  , URL = require('url')
  ;

function Agent(port, options) {

  options = options || {};

  if (!(this instanceof Agent)) {
    return new Agent(port, options);
  }
  var self = this;
  self.options = options;
  self.port = port;

  self.request = require('request-promise');
}

Agent.prototype.fix = function (url, options) {
  var target = URL.parse(url);
  if (options && options.internal === true) {
    target.protocol = 'http';
    target.slashes = true;
    target.port = this.port;
    target.hostname =  '127.0.0.1';
    target.host = null;
    delete url.host;
  }
  debug('url', URL.format(target));
  return URL.format(target);
};

Agent.prototype.get = function (url, options, callback) {
  debug('get(options)', options);
  return this.request.get(this.fix(url, options), options, callback);
};

Agent.prototype.post = function (url, options, callback) {
  if (typeof options.body === 'object') {
    options.body = qs.stringify(options.body);
    if (options.headers === undefined || typeof options.headers !== 'object') {
      options.headers = {};
    }
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.headers['Content-Length'] = options.body.length;
  }
  debug('post(options)', options);
  return this.request.post(this.fix(url, options), options, callback);
};

Agent.prototype.head = function (url, options, callback) {
  return this.request.head(this.fix(url, options), options, callback);
};

Agent.prototype.patch = function (url, options, callback) {
  return this.request.patch(this.fix(url, options), options, callback);
};

Agent.prototype.delete = function (url, options, callback) {
  return this.request.delete(this.fix(url, options), options, callback);
};

Agent.prototype.put = function (url, options, callback) {
  return this.put(this.fix(url, options), options, callback);
};


module.exports = Agent;
