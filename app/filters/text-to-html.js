'use strict';

var path = require('path');
var basename = path.basename(__filename, '.js');
var debug = require('debug')('lodex:' + basename);
var assert = require('assert');

module.exports = function(exec, execmap) {
  var filters = {};

  filters.textToHtml = function textToHtml(obj, args) {
    return exec(args, function(args) {
      debug('textToHtml(', obj, ',', args, ')');
      assert(typeof obj === 'string');
      // Encode into hexadecimal entities
      // < -> &#60;
      var html = obj.replace(/[\u00A0-\u9999<>&]/gim, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
      });

      // Put URLs into an HREF
      // See https://regex101.com/r/jO8bC4/5
      var urlRegex = /([a-z]+:\/+)([^\/\s]*)([a-z0-9\-@\^=%&;\/~\+]*)[\?]?([^ #]*)#?([^ #]*)/ig;
      html = html.replace(urlRegex, '<a href="$&">$&</a>');
      return html;
    }, 'textToHtml');
  };

  return filters;
};
