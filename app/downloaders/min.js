'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  , JBJ = require('jbj')
  ;

module.exports = function(options, core) {
  options = options || {};
  options.uniqueValueWith = options.uniqueValueWith ? options.uniqueValueWith : {};

  if (typeof options.uniqueValueWith !== 'object' || Object.keys(options.uniqueValueWith).length === 0) {
    options.uniqueValueWith = {
      "get": ["value", "_content.json.title", "title", "_label", "_text", "basename"],
      "deduplicate" : true,
      "cast" : "array",
      "first": true,
      "default" : "n/a"
    } ;
  }
  var stylesheet = {
    "_id<": {
      "get": ["_wid", "_id"],
      "deduplicate" : true,
      "cast" : "array",
      "first": true,
      "default" : "n/a"
    },
    "value<": options.uniqueValueWith
  }
  return function (data, submit) {
    if (!data._wid && data._id && data.value) {
      submit(null, {
        _id : data._id,
        value: data.value
      });
    }
    else {
      debug('stylesheet', stylesheet);
      JBJ.inject(stylesheet, data, function(err, res) {
        submit(err, res);
      })
    }
  }
}

