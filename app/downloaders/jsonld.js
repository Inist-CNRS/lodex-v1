'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('lodex:downloaders:' + basename);

module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {

    if (typeof data['_columns'] === 'object' && data['_columns'] !== null) {
      if (!data['_content']) {
        data['_content'] = {};
      }
      data['_content'].jsonld = {};
      data['_content'].jsonld['@id'] = data['_uri'];
      data['_content'].jsonld['@context'] = {};
      Object.keys(data['_columns'])
      .filter(function (propertyName) {
        return data['_columns'][propertyName].cover === 'collection';
      })
      .forEach(function(propertyName) {
        var node = data['_columns'][propertyName] || data['_collection']['_columns'][propertyName];
        if (node.scheme) {
          data['_content'].jsonld[propertyName] = node.content;
          data['_content'].jsonld['@context'][propertyName] = {};
          data['_content'].jsonld['@context'][propertyName]['@id'] = node.scheme;
          if (node.type) {
            data['_content'].jsonld['@context'][propertyName]['@type'] = node.type;
          }
          if (node.language) {
            data['_content'].jsonld['@context'][propertyName]['@language'] = node.lang;
          }
        }
      });

      data['_content'].jsonld['@context'].dataset = {
        '@id': 'http://purl.org/dc/terms/isPartOf',
        '@type': 'https://www.w3.org/TR/xmlschema-2/#anyURI'
      };
      data['_content'].jsonld.dataset = data['_config'].baseURL + '/' + data['_config'].rootKEY;
    }
    submit(null, data);
  };
};
