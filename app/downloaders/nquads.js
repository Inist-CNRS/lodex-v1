'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('lodex:downloaders:' + basename),
  jsonld = require('jsonld')
  ;

module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {
    if (data['_content'].jsonld) {
      jsonld.toRDF(data['_content'].jsonld, { format: 'application/nquads' }, function(err, out) {
        if (err) {
          console.error(err);
          submit(null, {});
        }
        else {
          submit(null, out);
        }
      });
    }
    else {
      submit();
    }
  };
};
