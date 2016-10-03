'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:downloaders:' + basename)
  ;

module.exports = function(options, core) {
  options = options || {};
  return {
    onEach: function (data, submit) {
      var self = this;
      if (self.options.mimeType === 'application/json') {
        var prefix = '';
        if (!self.options.firstOnly) {
          if (self.zero === undefined) {
            self.zero = true;
            prefix = "[\n";
          }
          else {
            prefix = ",\n";
          }
        }
        submit(null, prefix + JSON.stringify(data));
      }
      else {
        submit(null, data);
      }
    },
    onEnd : function(submit) {
      var self = this;
      if (self.options.mimeType === 'application/json') {
        var eof = '';
        if (!self.options.firstOnly) {
          eof = "]\n";
        }
        submit(null, eof);
      }
      else {
        submit();
      }
    }
  }
}

