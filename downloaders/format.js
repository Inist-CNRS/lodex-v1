'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:downloaders:' + basename)
  , htmlspecialchars = require('htmlspecialchars')
  , XMLMapping = require('xml-mapping')
  , moment = require('moment')
  , marked = require('marked')
  ;



module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {

    Object.keys(data._columns).forEach(function(col) {
      var format = data._columns[col].format || 'raw';
      data._columns[col].content = {
        raw : data._columns[col].content,
        html: ''
      }
      if (format === 'raw') {
        data._columns[col].content.html = htmlspecialchars(data._columns[col].content.raw)
      }
      else if (format === 'component') {
        data._columns[col].content.html = XMLMapping.dump(data._columns[col].content.raw);
      }
      else if (data._columns[col].type === 'date' && format) {
        debug('date', typeof data._columns[col].content.raw, data._columns[col].content.raw, data._columns[col].format)
        data._columns[col].content.html = moment(data._columns[col].content.raw).format(data._columns[col].format);
      }
      else if (format === 'markdown') {
        data._columns[col].content.html = marked(data._columns[col].content.raw);
      }
    })
    submit(null, data);
  };
};
