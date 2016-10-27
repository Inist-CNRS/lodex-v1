'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:engines:' + basename)
  , nunjucks = require('nunjucks')
  , objectPath = require('object-path')
  ;

var getByScheme = function(document, scheme, options) {
  // debug('getByScheme', document);
  options = options || {};
  var cover = options.cover || 'collection';
  var language = options.language;
  var select = options.select;
  var fieldNames = Object.keys(document);

  var wantedField = fieldNames
  .map(function (fieldName) { return document[fieldName]; })
  .filter(function (field) { return field.scheme === scheme; })
  .filter(function (field) { return field.cover === cover; });

  if (language && wantedField.length > 1) {
    wantedField = wantedField
    .filter(function (field) { return field.lang === language; });
  }
  var res = wantedField.length ? wantedField[0] : null;
  if (res && select) {
    res = objectPath.get(res, select);
  }
  return res;
};

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
var getContentByScheme = function(document, scheme, options) {
  options = options || {};
  var format = options.format || 'html';
  var wantedField = getByScheme(document, scheme, options);
  return wantedField ? wantedField.content[format] : '';
};

/**
 * Convert columns object into an array of columns which cover value is given
 *
 * @param  {Object} columns a hash of fields
 * @param  {string} cover   the part of fields wanted (dataset, collection, document)
 * @return {Array}          array of selected columns
 */
var cover = function(columns, cover) {
  cover = cover || 'collection';
  var keys = Object.keys(columns);
  var filteredColumns = keys
  .map(function(key) {
    return columns[key];
  })
  .filter(function(column) { return column.cover === cover; });
  return filteredColumns;
};

module.exports = function(options, core) {
  options = options || {};
  options.autoescape = options.autoescape || false;
  var env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(options.views || 'views'),
    options
  );
  env.addFilter('cover',              cover);
  env.addFilter('getByScheme',        getByScheme);
  env.addFilter('getContentByScheme', getContentByScheme);
  return function (filePath, fileInput, callback) {
    env.render(filePath, fileInput, callback);
  };
};
