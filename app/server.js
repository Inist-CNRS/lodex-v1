'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:' + basename)
  , fs = require('fs')
  , kuler = require('kuler')
  , mime = require('mime')
  , express = require('express')
  , Loader = require('castor-load')
  , Computer = require('./helpers/compute.js')
  , Download = require('./helpers/download.js')
  , serveStatic = require('serve-static')
  , I18n = require('i18n-2')
  , Hook = require('./helpers/hook.js')
  , async = require('async')
  , MongoClient = require('mongodb').MongoClient
  , JBJ = require('jbj')
  , ACL = require('./helpers/acl.js')
  , passport = require('passport')
  , Errors = require('./helpers/errors.js')
  , Agent = require('./helpers/agent.js')
  , querystring = require('querystring')
  , datamodel = require('datamodel')
  , objectPath = require('object-path')
  ;

module.exports = function(config, online) {

  var core = {
    server : undefined,
    app : express(),
    jbj: JBJ,
    states : { },
    config : config,
    models : {},
    connect : undefined,
    computer : undefined,
    loaders : undefined,
    downloaders : undefined,
    heart: undefined,
    agent : new Agent(config.get('port')),
    passport : passport,
    acl : new ACL(),
    Errors : Errors
  };
  var internals = require('./helpers/internals.js')(core);


  //
  // Passport
  //
  core.passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
  });
  core.passport.deserializeUser(function(user, done) {
    done(null, JSON.parse(user));
  });



  //
  // Find & Detect extensionPath & viewPath & publicPath
  //
  var extensionPath, viewPath;
  try {
    extensionPath = require('./helpers/view.js')(config);
    console.info(kuler('Set extension directory. ', 'olive'), kuler(extensionPath, 'limegreen'));
    viewPath = path.resolve(extensionPath, './views');
    if (!fs.existsSync(viewPath)) {
      viewPath = extensionPath;
    }
  }
  catch (e) {
    return online(e);
  }

  //
  // viewPath can impove or change config
  //
  config.fix('connectionURI', 'mongodb://' + config.get('databaseHost') + '/' + config.get('databaseName'));


  var publicPath = [
    path.resolve(extensionPath, './public'),
    path.resolve(viewPath, './public'),
    path.resolve(__dirname, './public')
  ].filter(fs.existsSync).shift();
  if (publicPath === undefined) {
    return online(new Error('publicPath is not defined'));
  }


  //
  // JBJ
  // to load ./filters/
  //
  var filters = new Hook('filters');
  filters.from(extensionPath, __dirname);
  filters.over(config.get('filters'));
  filters.apply(function(hash, func) {
    JBJ.use(func);
  });

  //
  // JBJ
  // to load specials
  //
  JBJ.filters.getInternalURI = function(obj, arg, next) {
    var collname = objectPath.get(obj, '_collection._wid');
    var key = arg;
    var value = objectPath.get(obj, key);
    var baseuri = obj['_uri'].replace(obj['_wid'], '');
    internals.getWidByField(collname, key, value, function(err, found) {
      if (err) {
        return next(err);
      }
      return next(null, baseuri.concat(found));
    });
  };

  // JBJ
  // to load ./protocols/
  //
  var protocols = new Hook('protocols');
  protocols.from(extensionPath, __dirname);
  protocols.over(config.get('protocols'));
  protocols.apply(function(hash, func, item) {
    JBJ.register(item.pattern || hash, func(item.options || {}, core));
  });

  JBJ.register('local:', require('./protocols/local.js')({}, core));
  JBJ.register('http:', require('./protocols/http.js')({}, core));
  JBJ.register('https:', require('./protocols/https.js')({}, core));





  //
  //  create an heart & set heartrate
  //  load ./heartbeats/
  //
  try {
    core.heart = require('./helpers/heart.js')(config.get('heartrate'));
  }
  catch (e) {
    return online(e);
  }
  var heartbeats = new Hook('heartbeats');
  heartbeats.from(extensionPath, __dirname);
  heartbeats.over(config.get('heartbeats'));
  heartbeats.apply(function(hash, func, item) {
    item.repeat = Number(item.repeat);
    item.beat = Number(item.beat);
    core.heart.createEvent(Number.isNaN(item.beat) ? 1 : item.beat,
      { repeat: Number.isNaN(item.repeat) ? 0 : item.repeat },
      func(item.options, core));
  });
  core.heart.createEvent(2, { repeat: 1 }, require('./heartbeats/compute.js')({}, core));


  //
  // Models
  // load ./models/
  //
  core.models.init = require('./models/init.js');
  core.models.mongo = require('./models/mongo.js');
  core.models.getCollection = require('./models/get-collection.js');
  core.models.getDocument = require('./models/get-document.js');
  core.models.getDocuments = require('./models/get-documents.js');
  core.models.computeDocuments = require('./models/compute-documents.js');

  var models = new Hook('models');
  models.from(extensionPath, __dirname);
  models.over(config.get('models'));
  models.apply(function(hash, func, item) {
    core.models[hash] = func;
  });


  //
  // Check Database & Collections Index
  //
  datamodel([core.models.mongo, core.models.init])
  .apply(core)
  .then(function(res) {
    if (res.initState) {
      console.info(kuler('Collections index initialized.', 'olive'),
        kuler(core.config.get('collectionNameIndex'), 'limegreen'));
    }
  }).catch(online);


  //
  // Loaders for insert into mongodb
  // load ./loaders/
  //
  core.loaders = [];
  core.loaders.push(['**/*.jdx', require('./loaders/jdx.js'), {}]);
  core.loaders.push(['**/*.jdx', require('./loaders/reimport.js'), {}]);

  var loaders = new Hook('loaders');
  loaders.from(extensionPath, __dirname);
  loaders.over(config.get('loaders'));
  loaders.apply(function(hash, func, item) {
    core.loaders.push([item.pattern || '**/*', func, item.options]);
  });
  core.loaders.push(['**/*', require('./loaders/prepend.js'), { ark : config.get('ark') }]);
  core.loaders.push(['**/*', require('./loaders/uniqueid.js'),
    { uniqueIdentifierWith: config.get('uniqueIdentifierWith') }]);
  //core.loaders.push(['**/*', require('./loaders/document.js'),
  //  { stylesheet: config.get('importStylesheet') }]);
  core.loaders.push(['**/*', require('./loaders/append.js'), {}]);


  //
  // HOT folder
  //
  var ldr, ldropts;
  if (config.has('dataPath')) {
    objectPath.set(core.states, 'hotfolder.first.syncOver', false);
    try {
      ldropts = {
        // "dateConfig" : config.get('dateConfig'),
        connexionURI : config.get('connectionURI'),
        collectionName: config.get('collectionNameHotFolder'),
        concurrency : config.get('concurrency'),
        delay : config.get('delay'),
        maxFileSize : config.get('maxFileSize'),
        writeConcern : config.get('writeConcern'),
        ignore : config.get('filesToIgnore')
      };
      ldr = new Loader(config.get('dataPath'), ldropts);

      if (fs.existsSync(config.get('dataPath'))) {
        console.info(kuler('Watching hot directory. ', 'olive'),
                     kuler(config.get('dataPath'), 'limegreen'));
        core.loaders.forEach(function(loader) {
          ldr.use(loader[0], loader[1](loader[2], core));
        });
        ldr.sync(function(err) {
          if (err instanceof Error) {
            console.error(kuler('Loader synchronization failed.', 'red'),
                          kuler(err.toString(), 'orangered'));
          }
          else {
            console.info(kuler('Files and Database are synchronised.', 'olive'));
          }
        });
        config.set('collectionName', ldr.options.collectionName);
      }
    }
    catch (e) {
      return online(e);
    }
  }

  //
  // Add Mongo indexes
  //
  core.indexes = [];
  core.indexes.push({ _wid: 1 }); // wid = fid + number (which are unique)
  core.indexes.push({ _text: 'text' });
  core.indexes.push({ state: 1 });
  core.connect = function() {
    return MongoClient.connect(config.get('connectionURI'));
  };
  try {
    core.connect()
    .then(function(db) {
      db.collection(config.get('collectionName'))
      .then(function(coll) {
        debug('indexes', coll);
        var usfs = config.get('documentFields');
        core.indexes = Object.keys(usfs)
        .filter(function(i) {
          return i !== '$text' && usfs[i].noindex !== true;
        })
        .map(function(i) {
          var j = {};
          j[i.replace('$', '')] = 1;
          return j;
        });
        async.map(core.indexes, function(i, cb) {
          coll.ensureIndex(i, { w: config.get('writeConcern') }, function(err, indexName) {
            if (err instanceof Error) {
              console.error(kuler('Unable to create the index.', 'red'),
                            kuler(err.toString(), 'orangered'));
            }
            else {
              console.info(kuler('Index added.', 'olive'),
                           kuler(Object.keys(i)[0] + '/' + indexName, 'limegreen'));
            }
            cb(err, indexName);
          });
        }, function(e, ret) {
          if (e) {
            throw e;
          }
          db.close();
        });
      }).catch(function(e) {
        throw e;
      });
    }).catch(function(e) {
      throw e;
    });
  }
  catch (e) {
    return online(e);
  }


  //
  // Map/Reduce features
  // load ./operators
  //
  var cptlock, cptopts;
  try {
    cptopts = {
      port: config.get('port'),
      connectionURI : config.get('connectionURI'),
      collectionName: config.get('collectionNameHotFields'),
      concurrency : config.get('concurrency')
    };
    core.computer = new Computer(config.get('computedFields'), cptopts);

    core.computer.use('count', require('./operators/count.js'));
    core.computer.use('catalog', require('./operators/catalog.js'));
    core.computer.use('distinct', require('./operators/distinct.js'));
    core.computer.use('ventilate', require('./operators/ventilate.js'));
    core.computer.use('total', require('./operators/total.js'));
    core.computer.use('keys', require('./operators/keys.js'));
    core.computer.use('graph', require('./operators/graph.js'));
    core.computer.use('groupby', require('./operators/groupby.js'));
    core.computer.use('merge', require('./operators/merge.js'));
    core.computer.use('labelize', require('./operators/labelize.js'));
    core.computer.use('max', require('./operators/max.js'));
    core.computer.use('stats', require('./operators/stats.js'));

    var operators = new Hook('operators');
    operators.from(extensionPath, __dirname);
    operators.over(config.get('operators'));
    operators.apply(function(hash, func) {
      core.computer.use(hash, func);
    });
    var cptfunc = function() {
      if (cptlock === undefined || cptlock === false) {
        cptlock = true;
        core.heart.createEvent(2, { repeat: 1 }, function() {
          cptlock = false; // évite d'oublier un evenement pendant le calcul
          core.computer.run(function(err) {
            if (err instanceof Error) {
              console.error(kuler('Unable to compute some fields.', 'red'),
                            kuler(err.toString(), 'orangered'));
            }
            else {
              console.info(kuler('Corpus fields computed.', 'olive'));
              objectPath.set(core.states, 'hotfolder.first.syncOver', true);
            }
          });
        });
      }
    };
    if (ldr !== undefined) {
      ldr.on('browseOver', function (found) {
        objectPath.set(core.states, 'hotfolder.last.browseOver', found);
      });
      ldr.on('watching', function (err, doc) {
        if (err) { objectPath.set(core.states, 'hotfolder.last.error', err.toString()); }
        objectPath.set(core.states, 'hotfolder.last.watching', doc);
        cptfunc();
      });
      ldr.on('checked', function (err, doc) {
        if (err) { objectPath.set(core.states, 'hotfolder.last.error', err.toString()); }
        objectPath.set(core.states, 'hotfolder.last.checked', doc);
        cptfunc();
      });
      ldr.on('cancelled', function (err, doc) {
        if (err) { objectPath.set(core.states, 'hotfolder.last.error', err.toString()); }
        objectPath.set(core.states, 'hotfolder.last.cancelled', doc);
        cptfunc();
      });
      ldr.on('added', function (err, doc) {
        if (err) { objectPath.set(core.states, 'hotfolder.last.error', err.toString()); }
        objectPath.set(core.states, 'hotfolder.last.added', doc);
        cptfunc();
      });
      ldr.on('changed', function (err, doc) {
        if (err) { objectPath.set(core.states, 'hotfolder.last.error', err.toString()); }
        objectPath.set(core.states, 'hotfolder.last.changed', doc);
        cptfunc();
      });
      ldr.on('dropped', function (err, doc) {
        if (err) { objectPath.set(core.states, 'hotfolder.last.error', err.toString()); }
        objectPath.set(core.states, 'hotfolder.last.dropped', doc);
        cptfunc();
      });
      ldr.on('saved', function (doc) {
        objectPath.set(core.states, 'hotfolder.last.saved', doc);
        cptfunc();
      });

    }
  }
  catch (e) {
    return online(e);
  }

  //
  // MimeTypes
  var mimeTypes = config.get('mimeTypes');
  debug('mimeTypes', mimeTypes);
  mime.define(mimeTypes);


  //
  // Downloaders
  // load ./downloaders/
  //

  var dwlopts;
  try {

    dwlopts = {
      maxAge: config.get('maxAge'),
      concurrency : config.get('concurrency')
    };
    core.downloader = new Download(dwlopts);
    core.downloader.use('*', require('./downloaders/config.js')(config.expose(), core));
    core.downloader.use('*', require('./downloaders/uri.js')({}, core));
    core.downloader.use('*', require('./downloaders/fields.js')({}, core));
    core.downloader.use('*', require('./downloaders/min.js')({
      uniqueValueWith : config.get('uniqueValueWith')
    }, core));
    core.downloader.use('dry', require('./downloaders/dry.js')({}, core));
    core.downloader.use('jdx', require('./downloaders/jdx.js')({}, core));
    core.downloader.use('tsv', require('./downloaders/tsv.js')({}, core));

    var downloaders = new Hook('downloaders');
    downloaders.from(extensionPath, __dirname);
    downloaders.over(config.get('downloaders'));
    downloaders.apply(function(hash, func, item) {
      core.downloader.use(item.pattern || '*', func(item.options, core));
    });

    core.downloader.use('*', require('./downloaders/json.js')({}, core));
  }
  catch (e) {
    return online(e);
  }




  //
  // Strategies for PassportJS
  // load ./strategies/
  //
  var strategies = new Hook('strategies');
  strategies.from(extensionPath, __dirname);
  strategies.over(config.get('strategies'));
  strategies.apply(function(hash, func, item) {
    core.passport.use(func(item.options, core));
  });


  //
  // Authorizations
  // load ./authorizations/
  //
  var authorizations = new Hook('authorizations');
  authorizations.from(extensionPath, __dirname);
  authorizations.over(config.get('authorizations'));
  authorizations.apply(function(hash, func, item) {
    core.acl.use(item.pattern, func(item.options, core));
  });
  core.acl.use('* /**', require('./authorizations/recall.js')());



  //
  // define WEB Server
  //

  // report config vars
  if (config.get('trustProxy') === true) {
    core.app.enable('trust proxy');
  }



  //
  // Middlewares for Express
  // load ./middlewares/
  //
  try {
    core.app.use(function (req, res, next) {
      req.routeParams = {};
      req.config = config;
      req.core = core;
      next();
    });
    core.app.use(require('express-cache-response-directive')());
    core.app.use(require('morgan')(config.get('logFormat'), { stream : process.stderr }));
    core.app.use(require('serve-favicon')(path.resolve(publicPath, './favicon.ico')));
    core.app.use(require('cookie-parser')());
    core.app.use(require('express-session')({
      secret: __dirname,
      resave: false,
      saveUninitialized: false }));
    core.app.use(passport.initialize());
    core.app.use(passport.session());
    I18n.expressBind(core.app, {
      locales: ['en', 'fr'],
      directory: path.resolve(extensionPath, './locales')
    });
    core.app.use(require('./middlewares/i18n.js')());

    var middlewares = new Hook('middlewares');
    middlewares.from(extensionPath, __dirname);
    middlewares.over(config.get('middlewares'));
    middlewares.apply(function(hash, func, item) {
      core.app.use(item.path || hash, func(item.options, core));
    });
    core.app.use(function (req, res, next) {
      // shared function
      res.resolveTemplate = function(templateName, depth) {
        return [
          path.resolve(viewPath, templateName),
          path.resolve(__dirname, './views/', templateName)
        ].slice(0, depth).filter(fs.existsSync).shift();
      };
      next();
    });
  }
  catch (e) {
    return online(e);
  }


  //
  // View
  // to load ./engines/
  // for use ./views/
  //
  core.app.set('views', [viewPath, path.resolve(__dirname, './views/')]);

  core.app.engine('jbj', require('./engines/jbj.js')({}, core));
  core.app.engine('html', require('./engines/nunjucks.js')({ views: core.app.get('views') }, core));
  core.app.engine('txt', require('./engines/rawfile.js')({}, core));

  var engines = new Hook('engines');
  engines.from(extensionPath, __dirname);
  engines.over(config.get('engines'));
  engines.apply(function(hash, func, item) {
    core.app.engine(item.pattern || hash, func(item.options || {}, core));
  });
  core.app.set('view engine', config.get('defaultEngine'));




  if (config.get('rootURL') !== undefined && config.get('rootURL') !== '/') {
    core.app.route('/').all(function(req, res) {
      res.redirect(config.get('rootURL'));
    });
  }


  //
  // Access for route
  //
  //core.app.use(core.acl.route());
  core.app.route('/*').all(core.acl.route());


  //
  // Static server
  //
  core.app.use(serveStatic(publicPath, {
    maxAge: config.get('maxAge')
  }));

  //
  // API routes
  //


  //
  // Optionals routes
  // load ./routes/
  //
  var routes = new Hook('routes');
  routes.from(extensionPath, __dirname);
  routes.over(config.get('routes'));
  routes.apply(function(hash, func, item) {
    var router = express.Router();
    func(router, core);
    core.app.use(router);
  });

  // Mandatory route
  var restRouter = express.Router();
  require('./routes/rest.js')(restRouter, core);
  core.app.use(restRouter);


  //
  // catch 404 and forward to error handler
  //
  core.app.use(function(req, res, next) {
    debug('Error handler');
    next(new Errors.PageNotFound('Not Found'));
  });



  //
  // Route Errors handler
  //
  core.app.use(function errorsHandler(err, req, res, next) {
    var statusCode;
    if (res.headersSent === false) {
      if (err instanceof Errors.PageNotFound || err instanceof Errors.TableNotFound) {
        statusCode = 404;
      }
      else if (err instanceof Errors.InvalidParameters) {
        statusCode = 400;
      }
      else if (err instanceof Errors.Forbidden) {
        statusCode = 403;
      }
      else if (err instanceof Errors.Unavailable) {
        statusCode = 503;
      }
      else {
        statusCode = 500;
      }
    }
    if (req.user === undefined && statusCode === 403 && config.get('loginURL')) {
      res.redirect(config.get('loginURL') + '?' +
                   querystring.stringify({  url : req.originalUrl }));
      return;
    }
    res.status(statusCode);
    console.error(kuler('Route error for', 'red'), req.originalUrl,
                  kuler(statusCode + ' - ' + err.toString(), 'orangered'),
                  ' from ', req.get('referer'));
    if (req.accepts('html')) {
      res.render('error.html', {
        code: statusCode,
        name: err.name,
        message: err.message,
        error: err
      });
      return;
    }
    if (req.accepts('json')) {
      res.send({
        code: statusCode,
        name: err.name,
        message: err.message,
      });
      return;
    }
    res.type('text').send(err.toString());
  });


  //
  // Create HTTP server
  //
  //
  core.server = require('http').createServer(core.app);
  core.server.timeout = config.get('timeout');
  core.server.listen(config.get('port'), function() {
    online(null, core);
  });

  return core.server;
};
