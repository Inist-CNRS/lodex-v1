'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('lodex:downloaders:' + basename);
var htmlspecialchars = require('htmlspecialchars');
var XMLMapping = require('xml-mapping');
var moment = require('moment');
var marked = require('marked');


module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {

    Object.keys(data['_columns']).forEach(function(col) {
      var format = data['_columns'][col].format || 'raw';
      var type   = data['_columns'][col].type;
      data['_columns'][col].content = {
        raw : data['_columns'][col].content,
        html: ''
      };
      if (format === 'raw') {
        data['_columns'][col].content.html = htmlspecialchars(data['_columns'][col].content.raw);
      }
      else if (format === 'component') {
        data['_columns'][col].content.html = XMLMapping.dump(data['_columns'][col].content.raw);
      }
      else if (type === 'date' && format) {
        debug('date', typeof data['_columns'][col].content.raw, data['_columns'][col].content.raw,
              data['_columns'][col].format);
        data['_columns'][col].content.html = moment(data['_columns'][col].content.raw)
                                         .format(data['_columns'][col].format);
      }
      else if (format === 'markdown') {
        data['_columns'][col].content.html = marked(data['_columns'][col].content.raw);
      }
      else if (type === 'uri') {
        data['_columns'][col].content.html = '<a href="' + data['_columns'][col].content.raw +'">';
        if (format !== undefined) {
          data['_columns'][col].content.html += '<uri format="' + format + '">' + data['_columns'][col].content.raw + '</uri>'
        }
        else {
          data['_columns'][col].content.html += data['_columns'][col].content.raw
        }
        data['_columns'][col].content.html += '</a>';
      }
    });
    submit(null, data);
  };
};
