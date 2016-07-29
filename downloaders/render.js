'use strict';

var path = require('path'),
  basename = path.basename(__filename, '.js'),
  debug = require('debug')('castor:downloaders:' + basename)
  ;

module.exports = function(options, core) {
  options = options || {};
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
    onEnd:  function(submit) {
      var self = this;
      var template = self.documents.length === 1 ? 'item.html' : 'list.html';
      var locals = self.documents.length === 1 ? self.documents[0] : { documents : self.documents };
      self.stream.render(template, locals);
    }
  };
};
