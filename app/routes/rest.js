/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
, basename = path.basename(__filename, '.js')
, debug = require('debug')('lodex:routes:' + basename)
, datamodel = require('datamodel')
, recall = require('../helpers/recall.js')
, cors = require('cors')
;



module.exports = function(router, core) {

  var prefixURL = core.config.get('prefixURL');
  var prefixKEY = core.config.get('prefixKEY');
  var defaultAltValue = core.config.get('defaultAltValue');
  var rootKEY = core.config.get('rootKEY');
  var internals = require('../helpers/internals.js')(core);




  //
  // Define route parameters
  //
  router.param('resourceName', function(req, res, next, value) {
    debug('resourceName', value);
    req.routeParams.resourceName = value;
    next();
  });

  router.param('operator', function(req, res, next, value) {
    if (value !== undefined) {
      try {
        req.routeParams.operator = core.computer.operator(value);
        req.routeParams.operatorName = value;
      }
      catch (e) {
        return next();
      }
    }
    next();
  });

  router.param('documentName', function(req, res, next, value) {
    if (value !== '*' && value !== '$') {
      req.routeParams.documentName = value;
    }
    else {
      req.routeParams.documentName = undefined;
    }
    next();
  });

  router.param('fieldName', function(req, res, next, value) {
    if (value !== '*' && value !== '$') {
      req.routeParams.fieldName = value;
    }
    else {
      req.routeParams.fieldName = undefined;
    }
    next();
  });

  router.param('star', function(req, res, next, value) {
    if (value === '*') {
      req.routeParams.star = value;
    }
    else {
      req.routeParams.star = undefined;
    }
    next();
  });

  router.param('dollar', function(req, res, next, value) {
    if (value === '$') {
      req.routeParams.dollar = value;
    }
    else {
      req.routeParams.dollar = undefined;
    }
    next();
  });


  router.param('format', function(req, res, next, value) {
    req.routeParams.format = value;
    next();
  });



  //
  // table "root" & his rows
  //
  //
  router.route(prefixURL + '/' + rootKEY + '.:format')
    .get(function(req, res, next) {
      req.url = req.url.replace(rootKEY + '.' + req.routeParams.format, '*');
      req.query.alt = req.routeParams.format;
      if (req['_parsedOriginalUrl'].query) {
        req['_parsedOriginalUrl'].query += '&alt=' + req.routeParams.format;
      }
      else {
        req['_parsedOriginalUrl'].query = 'alt=' + req.routeParams.format;
      }
      next();
    });

  router.route(prefixURL + '/:star')
    .get(function(req, res, next) {
      if (req.routeParams.star === undefined) {
        return next();
      }
      debug('get ', '/:star', req.routeParams, req.query);
      if (req.query.alt === undefined) {
        if (req['_parsedOriginalUrl'].query) {
          req['_parsedOriginalUrl'].query += '&alt=' + defaultAltValue;
        }
        else {
          req['_parsedOriginalUrl'].query = 'alt=' + defaultAltValue;
        }
      }
      if (req.query.alt === 'html' && !req.query['%24limit']) {
        req['_parsedOriginalUrl'].query += '&%24limit='.concat(core.config.get('itemsPerPage'));
      }
      internals.getMasterCollection(function(err, collID) {
        if (err) {
          return next(err);
        }
        recall({
          port: req.config.get('port'),
          pathname: '/' + collID + '/*',
          // Don't use req.query because querystring cannot parse array like qs
          search: req['_parsedOriginalUrl'].query,
        })(res, next);
      });
    });





  //
  // table "root" & the default operator
  //
  router.route(prefixURL + '/:dollar')
    .get(function(req, res, next) {
      if (req.routeParams.dollar === undefined) {
        return next();
      }
      debug('get ', '/:dollar', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      internals.getMasterCollection(function(err, collID) {
        if (err) {
          return next(err);
        }
        recall({
          port: req.config.get('port'),
          pathname: '/' + collID + '/$',
          // Don't use req.query because querystring cannot parse array like qs
          search: req['_parsedOriginalUrl'].query,
        })(res, next);
      });
    });




  //
  // table "root" & the operator
  //
  router.route(prefixURL + '/:dollar:operator')
    .get(function(req, res, next) {
      if (req.routeParams.dollar === undefined || req.routeParams.operator === undefined) {
        return next();
      }
      debug('get ', '/:dollar:operator', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      internals.getMasterCollection(function(err, collID) {
        if (err) {
          return next(err);
        }
        recall({
          port: req.config.get('port'),
          pathname: '/' + collID + '/$' + req.routeParams.operatorName,
          // Don't use req.query because querystring cannot parse array like qs
          search: req['_parsedOriginalUrl'].query,
        })(res, next);
      });
    });





  //
  // row of table "root"
  //
  router.route(prefixURL + '/' + prefixKEY + '/:documentName.:format')
    .get(function(req, res, next) {
      req.url = req.url.replace('.' + req.routeParams.format, '');
      req.query.alt = req.routeParams.format;
      if (req['_parsedOriginalUrl'].query) {
        req['_parsedOriginalUrl'].query += '&alt=' + req.routeParams.format;
      }
      else {
        req['_parsedOriginalUrl'].query = 'alt=' + req.routeParams.format;
      }
      next();
    });



  router.route(prefixURL + '/' + prefixKEY + '/:documentName')
    .all(cors())
    .get(function(req, res, next) {
      if (req.routeParams.documentName === undefined) {
        return next();
      }
      debug('get ', '/' + prefixKEY + '/:documentName', req.routeParams);
      if (req.query.alt === undefined) {
        if (req['_parsedOriginalUrl'].query) {
          req['_parsedOriginalUrl'].query += '&alt=' + defaultAltValue;
        }
        else {
          req['_parsedOriginalUrl'].query = 'alt=' + defaultAltValue;
        }
      }
      internals.getMasterCollection(function(err, collID) {
        if (err) {
          return next(err);
        }
        recall({
          port: req.config.get('port'),
          pathname: '/' + collID + '/' + req.routeParams.documentName + '/*',
          // Don't use req.query because querystring cannot parse array like qs
          search: req['_parsedOriginalUrl'].query,
        })(res, next);
      });
    });




  //
  // row of table "root"
  //
  router.route(prefixURL + '/' + prefixKEY + '/:documentName/:star')
    .all(cors())
    .get(function(req, res, next) {
      if (req.routeParams.documentName === undefined) {
        return next();
      }
      debug('get ', '/' + prefixKEY + '/:documentName', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      internals.getMasterCollection(function(err, collID) {
        if (err) {
          return next(err);
        }
        recall({
          port: req.config.get('port'),
          pathname: '/' + collID + '/' + req.routeParams.documentName + '/*',
          query: req.query
        })(res, next);
      });
    });




  //
  // REST API : rows of table
  //
  router.route(prefixURL + '/:resourceName/:star.:format')
    .get(function(req, res, next) {
      req.url = req.url.replace('*.' + req.routeParams.format, '*');
      req.query.alt = req.routeParams.format;
      if (req['_parsedOriginalUrl'].query) {
        req['_parsedOriginalUrl'].query += '&alt=' + req.routeParams.format;
      }
      else {
        req['_parsedOriginalUrl'].query = 'alt=' + req.routeParams.format;
      }
      next();
    });


  router.route(prefixURL + '/:resourceName/:star')
    .all(cors())
    .get(function(req, res, next) {
      if (req.routeParams.resourceName === undefined || req.routeParams.star === undefined) {
        return next();
      }
      debug('get /:resourceName/:star', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      if (core.config.get('allowedAltValues').indexOf(req.query.alt) === -1) {
        return res.status(400).send('Bad Request').end();
      }

      datamodel([core.models.mongo, core.models.getCollection, core.models.getDocuments])
        .apply(req)
        .then(function(locals) {
          var cursor = locals.mongoCursor;
          var params = {
            firstOnly : req.query.fo || req.query.firstOnly || false,
            lang : req.lang,
            url : require('url').parse(req.protocol + '://' + req.get('host') + req.originalUrl),
            query : req.query,
            resourceName : req.routeParams.resourceName,
            documentName : req.routeParams.documentName,
            collection : locals.collection
          };
          core.downloader.over(req.query.alt, params).apply(cursor, res, next);
        })
        .catch(next);
    });




  //
  // REST API : fields of row
  //
  router.route(prefixURL + '/:resourceName/:documentName/:star')
    .all(cors())
    .get(function(req, res, next) {
      if (req.routeParams.resourceName === undefined ||
        req.routeParams.documentName === undefined ||
        req.routeParams.star === undefined) {
        return next();
      }
      debug('get /:resourceName/:documentName/:star', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      if (core.config.get('allowedAltValues').indexOf(req.query.alt) === -1) {
        return res.status(400).send('Bad Request').end();
      }
      // var collectionName = req.routeParams.resourceName === core.config.get('collectionNameIndex')
      //                      ? core.config.get('collectionNameIndex') : req.routeParams.resourceName;
      // var mongoDatabaseHandle = core.connect();
      // var mongoQuery = {
      //   _wid : req.routeParams.documentName,
      //   state :  {
      //     $nin: [ 'deleted', 'hidden' ]
      //   }
      // };

      // function error(err) {
      //   if (mongoDatabaseHandle) {
      //     mongoDatabaseHandle.close();
      //   }
      //   next(err);
      // }


      datamodel([core.models.mongo, core.models.getCollection, core.models.getDocument])
        .apply(req)
        .then(function(locals) {
          var cursor = locals.mongoCursor;
          var params = {
            firstOnly : req.query.fo || req.query.firstOnly || false,
            lang : req.lang,
            url : require('url').parse(req.protocol + '://' + req.get('host') + req.originalUrl),
            query : req.query,
            resourceName : req.routeParams.resourceName,
            documentName : req.routeParams.documentName,
            collection : locals.collection
          };
          core.downloader.over(req.query.alt, params).apply(cursor, res, next);
        })
        .catch(next);
    });




  //
  // REST API : default computation of table
  //
  router.route(prefixURL + '/:resourceName/:dollar')

    .all(cors())
    .get(function(req, res, next) {
      if (req.routeParams.resourceName === undefined || req.routeParams.dollar === undefined) {
        return next();
      }
      debug('get /:resourceName/:dollar', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      if (core.config.get('allowedAltValues').indexOf(req.query.alt) === -1) {
        return res.status(400).send('Bad Request').end();
      }
      req.query.$query = {
        _wid : req.routeParams.resourceName
      };
      req.query.field = '_label';
      req.routeParams.resourceName = 'index';
      req.routeParams.operator = core.computer.operator('labelize');
      datamodel([core.models.mongo, core.models.computeDocuments])
        .apply(req)
        .then(function(locals) {
          var cursor = locals.mongoCursor;
          var params = {
            firstOnly : req.query.fo || req.query.firstOnly || false,
            lang : req.lang,
            url : require('url').parse(req.protocol + '://' + req.get('host') + req.originalUrl),
            query : req.query,
            resourceName : req.routeParams.resourceName,
            documentName : req.routeParams.documentName,
            index : locals.table
          };
          core.downloader.over(req.query.alt, params).apply(cursor, res, next);
        })
        .catch(next);
    });




  //
  // REST API : computation of table
  //
  router.route(prefixURL + '/:resourceName/:dollar:operator')

    .all(cors())
    .get(function(req, res, next) {
      if (req.routeParams.resourceName === undefined ||
        req.routeParams.dollar === undefined ||
        req.routeParams.operator === undefined) {
        return next();
      }
      debug('get /:resourceName/:dollar:operator', req.routeParams);
      req.query.alt = req.query.alt === undefined ? 'min' : req.query.alt;
      if (core.config.get('allowedAltValues').indexOf(req.query.alt) === -1) {
        return res.status(400).send('Bad Request').end();
      }
      datamodel([core.models.mongo, core.models.computeDocuments])
        .apply(req)
        .then(function(locals) {
          var cursor = locals.mongoCursor;
          var params = {
            firstOnly : req.query.fo || req.query.firstOnly || false,
            lang : req.lang,
            url : require('url').parse(req.protocol + '://' + req.get('host') + req.originalUrl),
            query : req.query,
            resourceName : req.routeParams.resourceName,
            documentName : req.routeParams.documentName,
            index : locals.table
          };
          core.downloader.over(req.query.alt, params).apply(cursor, res, next);
        })
        .catch(next);
    });



  return router;
};
