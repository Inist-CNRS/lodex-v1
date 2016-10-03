'use strict';

var clone = require('clone')
  , Segmenter = require('segmenter')
  , each = require('async-each')
  , debug = require('debug')('lodex:loaders:jdx')
  ;

module.exports = function(options) {

  options = options || {};
  options.encoding = options.encoding ? options.encoding : 'utf8';
  options.separator = options.separator ? options.separator : undefined;

  return function (input, submit, conf) {


    var columns     = []
      , numb        = 0
      , concurrency = conf.concurrency || 1
      , delay       = conf.delay || 100
      , canRead     = true
      , saturated   = false;

    var readable = input.openStream({
      encoding: options.encoding
    });
    var seg = new Segmenter({ delimiter: "\n" });

    var timeoutID;
    var qe;
    var pause = function (resume) {
      canRead = false;
      clearTimeout(timeoutID);

      timeoutID = setTimeout(function() {
        if (qe.length() < concurrency) {
          canRead = true;
          resume();
        } else {
          pause(resume);
        }
      }, delay);
    };

    readable.on('data', function (chunk) {
      var lines = seg.fetch(chunk)

      each(lines, function(line, next) {
        ++numb;
        var buf = new Buffer(line, 'base64');
        var doc = clone(input, false);
        doc.content = {};
        doc.content.json = JSON.parse(buf.toString());
        qe = submit(doc);

        if (qe.length() >= concurrency) {
          pause(next);
        }
      });

    });
    readable.on('end', function() {
      if (numb > 0) {
        submit();
      } else {
        submit(new Error('No line detected !'));
      }
    });
    readable.on('error', function (e) {
      submit(e);
    });
  }
}
