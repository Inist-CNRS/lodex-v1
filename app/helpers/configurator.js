/*jshint node:true,laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  , extend = require('extend')
  , objectPath = require("object-path")
  , clone = require('clone')
  , fs = require('fs')
  ;

function Configurator() {

  if (!(this instanceof Configurator)) {
    return new Configurator();
  }
  this.config = {};
}

Configurator.prototype.fix = function fix(name, value) {
  this.config[name] = value;
};

Configurator.prototype.get = function get(path) {
  return objectPath.get(this.config, path);
};

Configurator.prototype.copy = function copy(path) {
  var val = this.get(path);
  if (val) {
    return clone(val);
  }
  else {
    return val;
  }
};


Configurator.prototype.has = function has(path) {
  if (!objectPath.has(this.config, path)) {
    return false;
  }
  else {
    var v = objectPath.get(this.config, path);
    if (v === undefined || v === null) {
      return false;
    }
    else {
      return true;
    }
  }
};

Configurator.prototype.set = function set(path, value) {
  objectPath.set(this.config, path, value);
};

Configurator.prototype.unset = function unset(path) {
  objectPath.del(this.config, path);
};

Configurator.prototype.load = function load(appname, customArgvParser) {
  require('rc')(appname, this.config, customArgvParser);
};

Configurator.prototype.local = function local(filename) {
  try {
    if (fs.existsSync(filename)) {
      this.merge(require(filename));
      this.set('dateConfig', fs.statSync(filename).mtime);
      return true;
    }
  }
  catch(e) {
    return e;
  }
}

Configurator.prototype.replace = function merge(obj) {
  var self = this
  Object.keys(obj).forEach(function(key) {
    self.config[key] = obj[key];
  });
};


Configurator.prototype.merge = function merge(obj) {
  var self = this
  Object.keys(obj).forEach(function(key) {
    var o = self.get(key) || {};
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        o = obj[key].concat(o);
      }
      else {
        extend(true, o, obj[key]);
      }
    }
    else {
      o = obj[key];
    }
    self.config[key] = o;
  });
};



Configurator.prototype.expose = function expose() {
  var conf = clone(this.config);
  var tohide = ['dataPath', 'viewPath', 'collectionName', 'connectionURI', 'connexionURI', 'configs', 'config', '$0', '_', 'browserifyModules', 'collectionsIndexName', 'tempPath', 'theme', 'h', 'd', 'debug', 'help', 'version', 'v', 'verbose', 'V'];
  tohide.forEach(function(n) {
    if (conf[n] !== undefined) {
      delete conf[n];
    }
  });
  return conf;
};

module.exports = Configurator;
