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
      data['_columns'][col].content = {
        raw : data['_columns'][col].content,
        html: ''
      };
      if (format === 'raw') {
        data['_columns'][col].content.html = htmlspecialchars(data['_columns'][col].content.raw);
      }
      else if (format === 'markdown') {
        data['_columns'][col].content.html = marked(data['_columns'][col].content.raw);
      }
      else if (format === 'component') {
        data['_columns'][col].content.html = XMLMapping.dump(data['_columns'][col].content.raw);
      }
      else if (format === 'moment') {
        var syntax = 'LL';
        if (data['_columns'][col].formatOptions &&
          data['_columns'][col].formatOptions.syntax) {
          syntax = data['_columns'][col].formatOptions.syntax;
        }
        data['_columns'][col].content.html = moment(data['_columns'][col].content.raw)
        .format(syntax);
      }
      else if (format === 'chart') {
        var chart = {
          chart : data['_columns'][col].formatOptions
        };
        data['_columns'][col].content.html = XMLMapping.dump(chart);
      }
      else if (format === 'picture') {
        var picture = {
          picture : data['_columns'][col].formatOptions
        };
        picture.picture.src = data['_columns'][col].content.raw;
        data['_columns'][col].content.html = XMLMapping.dump(picture);
      }
      else if (format === 'url') {
        var url = {
          a : {
            href : data['_columns'][col].content.raw,
            $t : data['_columns'][col].content.raw
          }
        };
        data['_columns'][col].content.html = XMLMapping.dump(url);
      }
      else if (format === 'uri') {
        var uri = {
          a : {
            href : data['_columns'][col].content.raw,
            knownuri : {
              href : data['_columns'][col].content.raw
            }
          }
        };
        data['_columns'][col].content.html = XMLMapping.dump(uri);
      }
      else if (format === 'istex') {
        var istex = {
          istex : {
            query : data['_columns'][col].content.raw,
          }
        };
        data['_columns'][col].content.html = XMLMapping.dump(istex);
      }


    });
    submit(null, data);
  };
};
