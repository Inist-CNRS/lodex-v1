'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:downloaders:' + basename)
  , marked = require('marked')
  , traverse = require('traverse')
  ;

module.exports = function(options, core) {
  options = options || {};
  traverse(core.config.get('print')).forEach(function (x) {
    if (x && typeof x === 'string') {
      this.update(marked(x));
    }
  });

  return {
    breakPipe : true,
    onEach: function (data, submit) {
      var self = this;
      if (!self.documents) {
        self.documents = [];
      }
      self.documents.push(data);
      submit();
    },
    onEnd:  function() {
      var self = this;
      if (self.documents === undefined) {
        self.documents = [];
      }
      var template = self.documents.length === 1 ? 'item.html' : 'list.html';
      var locals = self.documents.length === 1 ? self.documents[0] : { documents : self.documents };
      locals.print = core.config.get('print');
      self.stream.render(template, locals);
    }
  };
};
