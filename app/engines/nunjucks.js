'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:engines:' + basename)
  , nunjucks = require('nunjucks')
  ;

/**
 * Filter to get a field value in the document which uses a scheme
 *
 * Example of document:
 * { title1:
 *   { label: 'Dataset title',
 *     scheme: 'http://purl.org/dc/terms/title',
 *     type: 'string',
 *     format: 'raw',
 *     lang: 'en',
 *     content: { raw: 'Films', html: 'Films' },
 *     cover: 'dataset' },
 *  desc1:
 *   { label: 'Dataset description',
 *     scheme: 'http://purl.org/dc/terms/description',
 *     type: 'string',
 *     format: 'markdown',
 *     lang: 'en',
 *     content:
 *      { raw: 'Several films to demontrate the usage of __LODEX__',
 *        html: '<p>Several films to demontrate the usage of <strong>LODEX</strong></p>\n' },
 *     cover: 'dataset' },
 *  title:
 *   { title: 'Title',
 *     stylesheet: { content: 'Rocky' },
 *     label: 'Title',
 *     scheme: 'http://purl.org/dc/terms/title',
 *     type: 'string',
 *     lang: 'fr',
 *     displayAreas: { facet: false, table: true },
 *     content: { raw: 'Rocky', html: 'Rocky' },
 *     cover: 'collection' },
 *  description:
 *   { label: 'Description',
 *     scheme: 'http://purl.org/dc/terms/description',
 *     type: 'string',
 *     content: { raw: 'John G. Avildsen', html: 'John G. Avildsen' },
 *     cover: 'collection' }}
 *
 * Usage in HTML:
 * <h2>{{ _columns|getByScheme('http://purl.org/dc/terms/title')|d('Missing "title"')}}</h2>
 *
 * @param  {Object} document contains the list of document's fields (with all attributes)
 * @param  {string} scheme   URI of the property to find in the document
 * @param  {Object} options  Any or all of the following options:
 *                           - cover: 'dataset', 'collection' (default)
 *                           - format: 'html' (default), 'raw'
 *                           - language: 'fr', 'en' (not used by default)
 * @return {string}          value of the document's fields matching the scheme (and the options)
 */
var getByScheme = function(document, scheme, options) {
  debug('getByScheme', document);
  options = options || {};
  var cover = options.cover || 'collection';
  var format = options.format || 'html';
  var language = options.language;
  var fieldNames = Object.keys(document);

  var wantedField = fieldNames
  .map(function (fieldName) { return document[fieldName]; })
  .filter(function (field) { return field.scheme === scheme; })
  .filter(function (field) { return field.cover === cover; });

  if (wantedField.length === 0) {
    return '';
  }
  if (language && wantedField.length > 1) {
    wantedField = wantedField
    .filter(function (field) { return field.lang === language; });
  }
  return wantedField[0].content[format];
};

module.exports = function(options, core) {
  options = options || {};
  options.autoescape = options.autoescape || false;
  var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(options.views || 'views'),
    options
  );
  env.addFilter('getByScheme', getByScheme);
  return function (filePath, fileInput, callback) {
    env.render(filePath, fileInput, callback);
  };
};
