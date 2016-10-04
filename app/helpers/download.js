/*jshint node:true,laxcomma:true*/
'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  , assert = require('assert')
  , minimatch = require('minimatch')
  , es = require('event-stream')
  , mime = require('mime')
  , crypto = require('crypto')
  , Errors = require('../helpers/errors.js')
  , sha1 = function(str) {
      return crypto.createHash('sha1').update(str).digest('hex')
    }
    ;


  function Chain (statements, options)
  {
    this.statements = statements;
    this.options = options;
  }

  Chain.prototype.apply = function (cursor, res, next) {

    var statements = this.statements;
    var options = this.options;

    if (!Array.isArray(statements) || statements.length <= 0) {
      return next();
    }

    cursor.count().then(function(count) {
      var counter = 0
      var onendrs = [];
      var scopes = [];
      var stream = cursor;
      var breakPipe = false;

      if (count === 0) {
        return next(new Errors.TableEmpty('`' + options.collection._wid + '` is empty.'));
      }

      debug('processing ' + count + ' document(s) to ', options.fileName + ' (' + options.mimeType +')');

      res.set('ETag', String('W/').concat(crypto.createHash('md5').update(String(count)).digest('base64').replace(/=+$/, '')));
      res.set('Content-Type', options.mimeType);
      res.cacheControl("public", {
        mustRevalidate: true,
        maxAge: options.maxAge
      });
      res.on('finish', function() {
        cursor.close();
      });
      cursor.on('end', function() {
        debug('cursor end with ', counter, 'documents');
      })



      stream = stream.pipe(es.map(function (data, callback) {
        if (counter === 0) {
          debug('streaming started')
        }
        if (!data._count) {
          data._count = [counter++, count];
        }
        if (!data._collection) {
          data._collection = options.collection;
        }
        if (!data._content) {
          data._content = {}
        }
        callback(null, data)
      }));

      if (options.firstOnly) {
        stream = stream.pipe(es.map(function (data, callback) {
          if (data._count[0] === 0) {
            callback(null, data)
          }
          else {
            callback();
          }
        }));
      }

      statements.forEach(function(item, idx) {
        var trace = [item.id, options.syntax];
        scopes[idx] = {
          counter : 0,
          options : options,
          stream: res
        };
        if (item.breakPipe === true) {
          debug('Pipe is breaking by',  trace.join('/'));
          breakPipe = true;
        }
        stream = stream.pipe(es.map(function (data, callback) {
          try {
            onendrs[idx] = idx;
            item.oneach.call(scopes[idx], data, function (error, output) {
              scopes[idx].counter++;
              if (error) {
                debug('fail onEach', trace.join('/'), 'on', scopes[idx].counter, error);
                callback(null, error);
              }
              else {
                //debug('success onEach', trace.join('/'), 'on', scopes[idx].counter)
                callback(null, output);
              }
            });
          }
          catch(e) {
            debug('error onEach', trace.join('/'), e.toString(), item.oneach);
            callback(null, e);
          }
        }));
      })

      stream.on("end", function() {
        onendrs.forEach(function(idx) {
          var onend = statements[idx].onend;
          if (typeof onend === 'function') {
            debug('apply onEnd', idx)
            onend.call(scopes[idx], function (error, output) {
              if (error) {
                debug('onend failed', error)
              }
              else if (output) {
                res.write(output);
              }
              res.end();
            });
          }
        })
      });

      if (!breakPipe) {
        stream = stream.pipe(es.map(function (data, callback) {
          if (typeof data !== 'string') {
            callback(null, data.toString());
          }
          else {
            callback(null, data);
          }
        }));
        stream.pipe(res);
      }

    }).catch(next)
  }


  function Download(options) {

    options = options || {};

    if (!(this instanceof Download)) {
      return new Download(options);
    }
    this.options = {};
    this.options.concurrency = options.concurrency || 1;
    this.options.maxAge = options.maxAge || "1 day";
    this.bank = [];

  }

  Download.prototype.use = function (pattern, fn)
  {
    var oneach, onend, id;

    if (fn === undefined) {
      fn = pattern;
      pattern = '*';
    }
    if (typeof fn === 'function') {
      oneach = fn;
    }
    else if (typeof fn === 'object') {
      if (typeof fn.onEach === 'function') {
        oneach = fn.onEach
      }
      if (typeof fn.onEnd === 'function') {
        onend = fn.onEnd
      }
    }
    assert.equal(typeof pattern, 'string');
    assert.equal(typeof oneach, 'function');

    id = sha1(oneach.toString().concat(onend)).slice(-12);


    if (!this.bank.reduce(function(prev, cur) { return cur.id === id; } , false)) {
      debug('Register '+id, 'on ' + pattern);
      this.bank.push({
        breakPipe : fn.breakPipe || false,
        pattern : pattern,
        oneach : oneach,
        onend: onend,
        id : id
      });
    }
    else {
      debug('Ignore '+id, 'on ' + pattern);
    }
    return this;
  };

  Download.prototype.over = function (syntax, options)
  {
    assert.equal(typeof syntax, 'string');
    var self = this;
    var currentDate = new Date();

    options = options || {};
    if (options.fileName === undefined) {
      options.fileName = currentDate.toJSON().substring(0, 10).concat('-');
      if (options.resourceName) {
        options.fileName = options.fileName.concat(options.resourceName);
      }
      if (options.documentName) {
        options.fileName = options.fileName.concat('.').concat(options.documentName)
      }
      options.fileName = options.fileName.concat('.').concat(syntax);
    }
    options.firstOnly = options.firstOnly || false;
    options.mimeType = mime.lookup(syntax || 'min');
    options.syntax = syntax;
    options.collection = options.collection || {};

    var statements = [];
    self.bank.forEach(function(item, idx) {
      if (minimatch(syntax, item.pattern)) {
        debug('syntax ' + syntax +  ' matching with', item.pattern, item.id)
        statements[idx] = item;
      }
    })

    return new Chain(statements, options);
  };


  module.exports = Download;
