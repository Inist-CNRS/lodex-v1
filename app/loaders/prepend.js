'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:loaders:' + basename)
  , shorthash = require('short-hash')
  , ARK = require('inist-ark')
  ;
module.exports = function(options) {
  options = options || {};
  var idt = false;
  if (options.ark) {
    idt = new ARK(options.ark);
  }
  return function (input, submit) {
    input.name = path
    .basename(input.location, path.extname(input.location))
    .replace(/[_\-\.]+/g, ' ');

    if (idt === false) {
      input.identifier = shorthash(input.fid + input.number);
    }
    else {
      var oid = idt.parse(idt.generate());
      input.identifier = oid.name;
    }

    submit(null, input);
  };
};
