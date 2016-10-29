/*jshint node:true, laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:loaders:' + basename)
  , JBJ = require('jbj')
  ;



module.exports = function(options) {
  options = options || {};
  options.uniqueIdentifierWith = options.uniqueIdentifierWith ? options.uniqueIdentifierWith : {};

  if (typeof options.uniqueIdentifierWith !== 'object' ||
      Object.keys(options.uniqueIdentifierWith) === 0) {
    options.uniqueIdentifierWith = {
      get: ['identifier', '_content.json.id', '_content.json.uid', '_wid', '_id'],
      coalesce: true
    };
  }
  var stylesheet = {
    'wid<':  options.uniqueIdentifierWith
  };

  return function (input, submit) {
    if (input.content && !input['_content']) {
      input['_content'] = input.content;
      delete input.content;
    }
    JBJ.inject(stylesheet, input, function(err, res) {
      if (res) {
        input['_wid'] = res.wid;
      }
      submit(err, input);
    });
  };
};
