'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  , fs = require('fs')
  , include = require('../helpers/include.js')
  ;


module.exports = function(config) {

  var themefile
    , themedirs = [];
  if (config.has('theme')) {
    themedirs.push(config.get('theme'));
  }
  else if (config.has('viewPath')) {
    themedirs.push(config.get('viewPath'));
  }
  themedirs.push(process.cwd());
  themedirs.push(process.env.HOME);
  themedirs.push(path.resolve(__dirname, '..', 'views'));

  if (themefile === undefined) {
    try {
      themefile = include(themedirs, 'castor.config.js', false);
    }
    catch (e) { console.error(e); return; }
  }

  if (themefile === undefined) {
    try {
      themefile = include(themedirs, 'castor.js', false);
    }
    catch (e) { console.error(e); return; }
  }

  if (themefile === undefined) {
    try {
      themefile = include(themedirs, 'config.js', false);
    }
    catch (e) { console.error(e); return; }
  }


  if (themefile === undefined) {
    themefile = include(themedirs, 'index.js', false);
  }

  var themepath = path.dirname(themefile)
    , themepack = path.join(themepath, 'package.json')
    , themeconf = require(themefile) || {}
    ;

  if (fs.existsSync(themepack)) {
    config.set('package', require(themepack));
  }

  config.replace(themeconf);
  return themepath;
};
