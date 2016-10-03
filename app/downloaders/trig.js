'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('castor:downloaders:' + basename),
  // jsonld = require('jsonld'),
  N3 = require('n3')
  ;

module.exports = function(options, core) {
  options = options || {};
  return {
    breakPipe : true,
    onEach: function (data, submit) {
      var self = this;
      if (!self.writer) {
        self.writer = N3.Writer(self.stream, { format: 'application/trig' });
      }
      if (data._content.jsonld) {
        Object
        .keys(data._content.jsonld['@context'])
        .map(function(key) {
          return {
            subject:   data._content.jsonld['@id'],
            predicate: data._content.jsonld['@context'][key]['@id'],
            object:    data._content.jsonld[key] || 'n/a'
          };
        })
        .forEach(function(triple) {
          self.writer.addTriple(triple);
        });
      }
      submit();
    },
    onEnd:  function(submit) {
      var self = this;
      self.writer.end();
    }
  };
};
