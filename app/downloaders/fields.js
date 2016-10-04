'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  , merge = require('merge')
  , JBJ = require('jbj')
  ;

function fieldsOf(markup, data) {
  if (!data) {
    return {};
  }
  Object.keys(data).forEach(function(key) {
    data[key].cover = markup;
  });
  return data;
}


module.exports = function(options, core) {
  options = options || {};
  return function (data, submit) {
    if (!data['_wid'] && data['_id'] && data.value) {
      submit(null, {
        _id : data['_id'],
        value: data.value
      });
    }
    else if (data['_wid'] && data['_columns']) {
      //debug('download document cache')
      submit(null, data);
    }
    else {
      var stylesheet;
      // debug('Compute Fields of', data)
      // *Fields
      // sont relatif aux documents de chaque collection de données
      // pas de la collection index
      // dans les cas particulier ou le cherche à télécharger ces documents
      // pour que les *Fields soient applicable ( en fonction de leur niveau)
      // ont doit faire une translation des données
      //
      //
      // data._fields                           |
      // data._collection._fields                > sont des Template JBJ de type inject
      // data._collection._dataset._fields      |
      // ----------------------------------------
      // data._columns                          > Resulats de transformation des fields
      //

      if (data['_wid'] === 'index') {
        //debug('download dataset data')

        var ddata = {};
        Object.keys(data).filter(function(key) {
          return key[0] === '_' && key !== '_config' && key !== '_collection';
        }).forEach(function(key) {
          ddata[key] = data[key];
        });

        // translation
        data['_collection'] = {};
        data['_collection']['_dataset'] = ddata;

        data['_collection']['_dataset']['_fields'] = data['_collection']['_dataset']['_fields'] ||
                                                     core.config.copy('datasetFields');
        data['_collection']['_fields']  = {};
        data['_fields']                 = {};

        stylesheet = merge(stylesheet,
          fieldsOf('dataset', data['_collection']['_dataset']['_fields'])
          // La notion de collectionFields ne s'applique pas à ce niveau
          // La notion de documentField ne s'applique pas à ce niveau
        );

      }
      else if (data['_collection']['_wid'] === 'index') {
        //debug('download collection data')

        var cdata = {};
        Object.keys(data).filter(function(key) {
          return key[0] === '_' && key !== '_config';
        }).forEach(function(key) {
          cdata[key] = data[key];
        });

        // translation
        data['_collection'] = cdata;

        data['_collection']['_dataset'] = data['_collection']['_collection'] || {};
        delete data['_collection']['_collection'];
        delete data['_collection']['_config'];
        data['_collection']['_dataset']['_fields'] = data['_collection']['_dataset']['_fields'] ||
                                                     core.config.copy('datasetFields');
        data['_collection']['_fields']             = data['_collection']['_fields'] ||
                                                     core.config.copy('collectionFields');
        data['_fields']                            = {};

        stylesheet = merge(stylesheet,
          fieldsOf('dataset', data['_collection']['_dataset']['_fields']),
          fieldsOf('collection', data['_collection']['_fields'])

          // La notion de documentField ne s'applique pas à ce niveau
        );

      }
      else {
        data['_collection']['_dataset']['_fields'] = data['_collection']['_dataset']['_fields'] ||
                                                     core.config.copy('datasetFields');
        data['_collection']['_fields']             = data['_collection']['_fields'] ||
                                                     core.config.copy('collectionFields');
        data['_fields']                            = data['_fields'] ||
                                                     core.config.copy('documentFields');


        stylesheet = merge(stylesheet,
          fieldsOf('dataset', data['_collection']['_dataset']['_fields']),
          fieldsOf('collection', data['_collection']['_fields']),
          fieldsOf('document', data['_fields'])
        );
        //debug('download document data')
      }

      JBJ.inject(stylesheet, data, function(err, cols) {
        if (err) {
          return submit(err);
        }
        data['_columns'] = cols;
        delete data['_fields'];
        delete data['_collection']['_fields'];
        delete data['_collection']['_dataset']['_fields'];
        submit(null, data);
      });
    }
  };
};

