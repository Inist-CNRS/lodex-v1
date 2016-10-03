/*jshint node:true, laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , path = require('path')
  , JBJ = require('jbj')
  , objectPath = require('object-path')
  ;



module.exports = function(options) {
  options = options || {};
  options.stylesheet = options.stylesheet ? options.stylesheet : {};

  if (typeof options.stylesheet !== 'object') {
    options.stylesheet = {};
  }
  return function (input, submit) {
    JBJ.render(options.stylesheet, input, function (err, res) {
      for (var field in options.stylesheet) {
        // Remove all nosave documentFields
        if (options.stylesheet[field].nosave) {
          field = field.slice(1);
          objectPath.del(res,field);
        }
        // Truncate all indexed documentFields
        else if (!options.stylesheet[field].noindex) {
          field = field.slice(1);
          var value = objectPath.get(res, field);
          if (field !== '_text' && typeof value === 'string') {
            objectPath.set(res,field,value.slice(0,999));
          }
        }
      }
      submit(null, res);
    });
  };
};
