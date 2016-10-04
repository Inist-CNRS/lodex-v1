'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  ;

module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {
    if (!data['_wid'] && data['_id'] && data.value) {
      submit(null, {
        _id : data['_id'],
        value: data.value
      });
    }
    else {
      var baseURL, prefixKEY, baseURI;

      if (data['_collection']['_isRoot'] === true) {
        prefixKEY = core.config.get('prefixKEY');
      }
      else {
        prefixKEY = data['_collection']['_wid'];
      }
      if (prefixKEY === undefined ||
          data['_collection']['_wid'] === core.config.get('collectionNameIndex')) {
        prefixKEY = '';
      }
      if (data['_collection']['_isRoot'] === true) {
        prefixKEY = core.config.get('prefixKEY');
      }
      else {
        prefixKEY = data['_collection']['_wid'];
      }
      if (prefixKEY === undefined ||
          data['_collection']['_wid'] === core.config.get('collectionNameIndex')) {
        prefixKEY = '';
      }
      if (core.config.get('trustProxy')) {
        baseURL = 'http://' + data.hostname;
      }
      else {
        baseURL = String(core.config.get('baseURL')).replace(/\/+$/, '');
      }
      if (prefixKEY === '') {
        baseURI = '';
      }
      else {
        baseURI = baseURL.concat('/').concat(prefixKEY);
      }

      data['_uri'] = baseURI.concat('/').concat(data['_wid']);
      submit(null, data);
    }
  };
};
