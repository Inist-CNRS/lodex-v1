'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('castor:downloaders:' + basename),
  JBJ = require('jbj');


JBJ.use(require('jbj-array'));
JBJ.use(require('jbj-parse'));
JBJ.use(require('jbj-template'));
JBJ.use(require('jbj-rdfa'));
JBJ.use(require('jbj-nlp'));
JBJ.use(require('../filters/jbj-misc.js'));
JBJ.use(require('../filters/text-to-html.js'));


var stylesheet = require('../views.stylesheet.json');

module.exports = function(options, core) {
  options = options || {};

  return function (data, submit) {

    JBJ.render(stylesheet, {data:data}, function(err, res) {
      submit(err, res);
    });
  };
};
