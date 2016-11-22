'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  , CSV = require('csv-string')
  ;

module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {
    // eslint-disable-next-line no-invalid-this
    var self = this;
    var head = '';
    debug('data tsv', data);
    data['_columns']['_uri'] = {};
    data['_columns']['_uri'].title = 'URI';
    data['_columns']['_uri'].content = data['_uri'];
    if (data['_count'][0] === 0) {
      self.stream.setHeader('Content-disposition', 'attachment; filename=' + self.options.fileName);
      head = CSV.stringify(Object.keys(data['_columns']).map(function(propertyName) {
        return data['_columns'][propertyName].title || propertyName;
      }), ',');
    }
    submit(null, head + CSV.stringify(Object.keys(data['_columns']).map(function(propertyName) {
      return data['_columns'][propertyName].content;
    }), ','));
  };
};
