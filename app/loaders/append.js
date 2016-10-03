'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , path = require('path')
  , shorthash = require('short-hash')
  ;

module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    var now = new Date();

    // _wid
    if (input.wid !== undefined) {
      input._wid = input.wid;
      delete input.wid;
    }
    if (typeof input._wid !== 'string') {
      delete input._wid;
    }
    if (input._wid === undefined) {
      input._wid = shorthash(input.fid + input.number);
    }

    // _text
    if (input.text) {
      input._text = input.text;
      delete input.text
    }
    else if (input._text === undefined) {
      input._text = '';
    }

    // _label
    if (input._label === undefined) {
      input._label = 'n/a';
    }


    // _hash
    if (input._hash === undefined) {
      input._hash = null;
    }

    // Dates
    if (input._modified === undefined) {
      input._modified = input.dateModified || now;
    }

    // _content
    if (input.content) {
      input._content = input.content;
      delete input.content
    }
    else if (input._content === undefined) {
      input._content = {};
    }

    input._rootSince = new Date(0);

    submit(null, input);
  }
}
