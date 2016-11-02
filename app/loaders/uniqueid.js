/*jshint node:true, laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:loaders:' + basename)
  , JBJ = require('jbj')
  ;



module.exports = function(options) {
  options = options || {};

  if (!options.uniqueIdentifierWith
    || typeof options.uniqueIdentifierWith !== 'object'
    ||  Object.keys(options.uniqueIdentifierWith).length === 0) {
    options.uniqueIdentifierWith = {
      get: ['_content.min._id', '_content.json.id', '_content.json.uid', '_wid', 'identifier', '_id'],
      coalesce: true
    };
  }
  var stylesheet = {
    'idt<':  options.uniqueIdentifierWith
  };

  return function (input, submit) {
    if (input.content && !input['_content']) {
      input['_content'] = input.content;
      delete input.content;
    }
    JBJ.inject(stylesheet, input, function(err, res) {
      if (res) {
        input.identifier = res.idt;
      }
      submit(err, input);
    });
  };
};
