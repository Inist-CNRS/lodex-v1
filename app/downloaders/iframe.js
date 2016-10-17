'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  ;

module.exports = function (options, core) {
  options = options || {};

  return {
    breakPipe: true,
    onEach: function(data, submit) {
      var self = this;
      if (!self.documents) {
        self.documents = [];
      }
      self.documents.push(data);
      submit();
    },
    onEnd: function() {
      var self = this;
      if (self.documents === undefined) {
        self.documents = [];
      }
      var template = self.documents.length === 1 ? 'embeddedItem.html' : 'embeddedDataset.html';
      var locals = self.documents.length === 1 ? self.documents[0] : { documents : self.documents };
      // locals.print = core.config.get('print');
      debug('rendering', template);
      self.stream.setHeader('Content-Type', 'text/html; charset=utf-8');
      self.stream.render(template, locals);
    }
  };
};
