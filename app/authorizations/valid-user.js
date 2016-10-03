'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:access:' + basename)
  ;

module.exports = function(options) {
  options = options || {};
  return function (req, authorize) {
    if (req.user !== undefined) {
      authorize(null, true);
    }
    else {
      authorize(null, false);
    }
  }
}
