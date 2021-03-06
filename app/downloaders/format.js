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
      debug('init', { col: col, content: data['_columns'][col].content });
      var format = data['_columns'][col].format || 'raw';
      data['_columns'][col].content = {
        raw : data['_columns'][col].content,
        html: ''
      };
      debug('debut', { col: col, content: data['_columns'][col].content });
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
        var locale = moment.locale();
        if (data['_columns'][col].formatOptions &&
          data['_columns'][col].formatOptions.syntax) {
          syntax = data['_columns'][col].formatOptions.syntax;
        }
        if (data['_columns'][col].formatOptions &&
          data['_columns'][col].formatOptions.locale) {
          locale = data['_columns'][col].formatOptions.locale;
        }
        data['_columns'][col].content.html = moment(data['_columns'][col].content.raw)
        .locale(locale)
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
      else if (format === 'embeduri') {
        var embeduri = {
          embeduri: {
            href : data['_columns'][col].content.raw
          }
        };
        data['_columns'][col].content.html = XMLMapping.dump(embeduri);
      }
      else if (format === 'istex') {
        var istex = {
          istex : {
            query : data['_columns'][col].content.raw,
          }
        };
        data['_columns'][col].content.html = XMLMapping.dump(istex);
      }
      else if (format === 'bag') {
        var inline = '';
        if (data['_columns'][col].formatOptions &&
          data['_columns'][col].formatOptions.inline) {
          inline = ' inline="true"';
        }

        data['_columns'][col].content.html = '<bag' + inline + '><ul>\n' +
          data['_columns'][col].content.raw
          .map(function (item) {
            return '<li>' + item + '</li>';
          })
          .join('\n') +
          '</ul></bag>';
      }

      debug('fin', { col: col, content: data['_columns'][col].content });

    });
    submit(null, data);
  };
};
