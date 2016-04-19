/*jshint node:true, laxcomma:true*/
/*eslint global-require:"off"*/
'use strict';

module.exports = function(config, start) {
  config.set('theme', __dirname);
  start();
};

if (!module.parent) {
  require('castor-core')(module.exports);
}
