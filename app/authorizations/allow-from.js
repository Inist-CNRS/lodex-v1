'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:authorizations:' + basename)
  ;

module.exports = function(options) {
  options = options || {};
  return function (req, authorize) {
    if (options.domain) {
      if (req.ip.indexOf(options.domain) >= 0) {
        authorize(null, true);
      }
      else {
        authorize(null, false);
      }
    }
    else {
      authorize(null, true);
    }
  }
}
