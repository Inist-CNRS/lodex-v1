'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug  = require('debug')('lodex:downloaders:' + basename)
  , errlog  = require('debug')('lodex:downloaders:' + basename + ':error')
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

      // Class should be computed after proprety
      var classes = {};
      Object.keys(stylesheet).forEach(function(key) {
        if (stylesheet[key].composedOf) {
          classes[key] = stylesheet[key];
          if (classes[key]['content<']) {
            var jxl = {};
            if (Array.isArray(classes[key].composedOf)) {
              jxl.get = classes[key].composedOf.map(function(i) { return i + '.content'; });
            }
            else {
              jxl.get = classes[key].composedOf + '.content';
            }
            Object.keys(classes[key]['content<']).forEach(function(i) {
              jxl[i] = classes[key]['content<'][i];
            });
            classes[key]['content<'] = jxl;
          }
          delete stylesheet[key];
        }
      });

      JBJ.inject(stylesheet, data, function(err, data01) {
        if (err) {
          errlog('JBJ inject(1) failed', err);
          return submit(err);
        }
        JBJ.inject(classes, data01, function(err, data02) {
          if (err) {
            errlog('JBJ inject(2) failed', err);
            return submit(err);
          }
          data['_columns'] = {};
          data['_columns'] = merge(data01, data02);
          delete data['_fields'];
          delete data['_collection']['_fields'];
          delete data['_collection']['_dataset']['_fields'];
          submit(null, data);
        });
      });
    }
  };
};

