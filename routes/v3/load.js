/*jshint node:true,laxcomma:true*/
'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:routes:' + basename)
  , fs = require('fs')
  , url = require('url')
  , bodyParser = require('body-parser')
  , crypto = require('crypto')
  , Errors = require('../../helpers/errors.js')
  , Loader = require('castor-load')
  , JBJ = require('jbj')
  , extend = require('extend')
  ;

module.exports = function(router, core) {

  router.route('/-/v3/load')
  .all(bodyParser.urlencoded({ extended: true}))
  .post(function(req, res, next) {
    var referer = url.parse(req.get('Referer'));
    var resourceName = path.basename(referer.pathname);

    if (typeof req.body !== 'object') {
      return next(new Errors.InvalidParameters('No body.'));
    }
    if (typeof req.body.hash !== 'object') {
      req.body.hash = {}
    }
    if (typeof req.body.text !== 'object') {
      req.body.text = {}
    }
    if (typeof req.body.label !== 'object') {
      req.body.label = {}
    }
    if (typeof req.body.enrich !== 'object') {
      req.body.enrich = {}
    }
    if (req.body.type === 'fork') {
      req.body.cutter = '!.*._content.json';
      resourceName = path.basename(req.body.uri);
    }
    if (resourceName === 'index') {
      return next(new Errors.Forbidden('`index` is read only'));
    }
    if (!resourceName || resourceName === '') {
      return next(new Errors.Forbidden('Invalid call.'));
    }

    // TODO : check if resourceName already exists
    var common = {
      baseURL : String(core.config.get('baseURL')).replace(/\/+$/,'')
    }

    var addField = function (fieldname, stylesheet) {
      return function (input, submit) {
        debug('JBJ fieldname', stylesheet);
        if (typeof stylesheet === 'object') {
          debug('JBJ stylesheet', stylesheet);
        }
        else {
          submit(null, input);
        }
      }
    }

    var options = {
      "collectionName" : resourceName,
      "connexionURI" : core.config.get('connectionURI'),
      "concurrency" : core.config.get('concurrency'),
      "delay" : core.config.get('delay'),
      "maxFileSize" : core.config.get('maxFileSize'),
      "writeConcern" : core.config.get('writeConcern'),
      "ignore" : core.config.get('filesToIgnore'),
      "watch" : false
    };
    debug('options', options);
    // Be careful, at this time, loader code should be different ! cf. https://github.com/castorjs/castor-load/blob/master/lib/mount.js#L58

    var ldr = new Loader(__dirname, options);
    ldr.use('**/*', require('../../loaders/extend.js')(common));
    core.loaders.forEach(function(loader) {
      var opts = loader[2] || {};
      if (loader[0].indexOf('.json') >=0  && req.body.cutter) {
        opts['cutter'] = String(req.body.cutter);
      }
      ldr.use(loader[0], loader[1](opts));
    });
    // ldr.use('**/*', function (input, submit) {
    // if (typeof req.body.hash !== 'object') {
    // return submit(null, input);
    // }
    // JBJ.render(req.body.hash, input, function (err, res) {
    // input._hash = res;
    // submit(err, input);
    // });
    // });
    // ldr.use('**/*', function (input, submit) {
    // if (typeof req.body.text !== 'object') {
    // return submit(null, input);
    // }
    // JBJ.render(req.body.text, input, function (err, res) {
    // input._text = res;
    // submit(err, input);
    // });
    // });
    // ldr.use('**/*', function (input, submit) {
    // if (typeof req.body.label !== 'object') {
    // return submit(null, input);
    // }
    // JBJ.render(req.body.label, input, function (err, res) {
    // input._label = res;
    // submit(err, input);
    // });
    // });
    ldr.use('**/*', function (input, submit) {
      if (typeof req.body.enrich !== 'object') {
        return submit(null, input);
      }
      JBJ.render(req.body.enrich, input, function (err, res) {
        if (typeof res === 'object') {
          extend(input, res);
        }
        submit(err, input);
      });
    });
    ldr.use('**/*', function (input, submit) {
      debug('compute new with', req.body.reskey);
      if (typeof req.body.reskey !== 'object') {
        return submit(null, input);
      }
      JBJ.render(req.body.reskey, input, function (err, res) {
        input._wid = res;
        debug('new wid', res);
        submit(err, input);
      });
    });

    if (req.body.type === 'file' && typeof req.body.file === 'object') {
      var p = require('os').tmpdir(); // upload go to tmpdir
      fs.readdir(p, function (err, files) {
        if (err) {
          throw err;
        }
        files.map(function (file) {
          return path.join(p, file);
        }).filter(function (file) {
          var token = crypto.createHash('sha1').update(file).digest('hex');
          return  (token === req.body.file.token);
        }).forEach(function (file) {
          ldr.push(file, {}, {}, function(doc) {
            doc.filename = doc.fid + '.' + req.body.loader;
            doc.extension = req.body.loader;
          });
        });
      });
    }
    else if (req.body.type === 'keyboard') {
      ldr.push(url.format({
        protocol: "http",
        hostname: "127.0.0.1",
        port: core.config.get('port'),
        pathname: "/-/v3/echo/keyboard." + req.body.loader,
        query: {
          plain : req.body.keyboard
        }
      }));
    }
    else if (req.body.type === 'uri') {
      ldr.push(req.body.uri, {}, {}, function(doc) {
        doc.filename = doc.fid + '.' + req.body.loader;
        doc.extension = req.body.loader;
      });
    }
    else if (req.body.type === 'fork') {
      var sourceName = path.basename(referer.pathname);
      debug('fork from',  url.format({
        protocol: "http",
        hostname: "127.0.0.1",
        port: core.config.get('port'),
        pathname: "/" + sourceName + '/*',
        query: {
          alt: "raw"
        }
      }));
      ldr.push(url.format({
        protocol: "http",
        hostname: "127.0.0.1",
        port: core.config.get('port'),
        pathname: "/" + sourceName + '/*',
        query: {
          alt: "raw"
        }
      }), {}, {}, function(doc) {
        doc.filename = 'forked.json';
        doc.extension = 'json';
      });
    }
    else {
      return next(new Errors.InvalidParameters('Unknown type.'));
    }
    res.json({});
  });

}
