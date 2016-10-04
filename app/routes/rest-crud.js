/*jshint node:true, laxcomma:true */
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:routes:' + basename)
  , bodyParser = require('body-parser')
  , URL = require('url')
  , cors = require('cors')
  , mqs = require('mongodb-querystring')
  , Loader = require('castor-load')
  , jsonpatch = require('fast-json-patch')
  ;


module.exports = function(router, core) {

  var prefixURL = core.config.get('prefixURL');

  //
  // Define route parameters
  //
  router.param('resourceName', function(req, res, next, value) {
    req.routeParams.resourceName = value;
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


  //
  // REST API : CRUD table
  //
  router.route(prefixURL + '/:resourceName')
  .all(cors())
  .post(bodyParser.json()) // for this.$http.post (vue-resource)
  .post(bodyParser.urlencoded({ extended: true })) // for $.ajax (jquery)
  .post(function(req, res, next) {
    if (req.routeParams.resourceName === undefined) {
      return next();
    }
    debug('post /:resourceName', req.routeParams);
    var collectionName = req.routeParams.resourceName === core.config.get('collectionNameIndex')
                       ? core.config.get('collectionNameIndex') : req.routeParams.resourceName;
    var loaderOptions =  {
      collectionName : collectionName,
      connexionURI : core.config.get('connectionURI'),
      concurrency : core.config.get('concurrency'),
      delay : core.config.get('delay'),
      maxFileSize : core.config.get('maxFileSize'),
      writeConcern : core.config.get('writeConcern'),
      ignore : core.config.get('filesToIgnore'),
      watch : false
    };
    var sharedFields = {
      baseURL : String(core.config.get('baseURL')).replace(/\/+$/, '')
    };
    var inputName = URL.parse(req.body.url);
    if (inputName.protocol === 'file:') {
      inputName = inputName.pathname;
    }
    else {
      inputName = URL.format(inputName);
    }
    var ldr = new Loader(__dirname, loaderOptions);
    ldr.use('**/*', require('../loaders/extend.js')(sharedFields));
    core.loaders.forEach(function(loader) {
      var opts = loader[2] || {};
      if (loader[0].indexOf('.json') >= 0) {
        opts['cutter'] = '!.*';
      }
      ldr.use(loader[0], loader[1](opts));
    });
    ldr.submit(inputName, function(err, docs) {
      var doc = Array.isArray(docs) ? docs[0] : docs;
      // console.dir(docs);
      if (err) {
        return next(err);
      }
      var qry = {
        $query : {
          fid : doc.fid
        }
      };
      var url = '/' + req.routeParams.resourceName + '/*?' + mqs.stringify(qry, {});
      res.location(url);
      res.sendStatus(201);
    });
  });


  //
  // REST API : CRUD document
  //
  router.route(prefixURL + '/:resourceName/:documentName')
  .all(cors())
  .post(bodyParser.text({ type: '*/*' }))
  .post(function(req, res, next) {
    if (req.routeParams.resourceName === undefined || req.routeParams.documentName === undefined) {
      return next();
    }
    debug('post /:resourceName/:documentName', req.routeParams);
    var collectionName = req.routeParams.resourceName === core.config.get('collectionNameIndex')
                       ? core.config.get('collectionNameIndex') : req.routeParams.resourceName;
    debug('req.body', req.body);
    var mongoOperation = mqs.parse(req.body);
    // TODO :
    // Ajouter l'opération pour changer la date de modification
    // Ajouter l'opération pour tracer celui qui a fait la modification
    var mongoQuery = {
      _wid : req.routeParams.documentName
    };

    core.connect().then(function(mongoDatabaseHandle) {
      function error(err) {
        if (mongoDatabaseHandle) {
          mongoDatabaseHandle.close();
        }
        next(err);
      }
      debug('Opération', collectionName, mongoQuery, mongoOperation);
      mongoDatabaseHandle.collection(collectionName).findOne(mongoQuery).then(function(original) {
        if (original === null) {
          return error(new core.Errors.TableNotFound('The table does not exist.'));
        }
        debug('Original', original);
        mongoDatabaseHandle
        .collection(collectionName)
        .updateOne(mongoQuery, mongoOperation)
        .then(function(r1) {
          debug('Result 1', r1.result);
          mongoDatabaseHandle
          .collection(collectionName)
          .findOne(mongoQuery)
          // I think we could return the result of findOne, and put .then()
          // after the first then -> less nesting
          .then(function(modified) {
            debug('Modified', modified);
            var patch = jsonpatch.compare(original, modified);
            debug('Patch', patch);
            mongoDatabaseHandle.collection(collectionName).updateOne(mongoQuery, {
              $push : {
                _patches : patch
              }
            }).then(function(r2) {
              debug('Result 2', r2.result);
              mongoDatabaseHandle.close();
              res.sendStatus(204);
            }).catch(error);
          }).catch(error);
        }).catch(error);
      }).catch(error);
    }).catch(next);
  });


  return router;
};
