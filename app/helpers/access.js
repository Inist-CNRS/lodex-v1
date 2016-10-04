'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:helpers:' + basename)
  ;

function Access(accessList) {
  if (Array.isArray(accessList) === false) {
    this.accessList = [accessList];
  }
  else {
    this.accessList = accessList;
  }
}

Access.prototype = {
  findById :  function(id, cb) {
    var self = this;
    process.nextTick(function() {
      var idx = id - 1;
      if (self.accessList[idx]) {
        return cb(null, self.accessList[idx]);
      }
      return cb(new Error('User ' + id + ' does not exist'));
    });
  },
  findByUsername : function(username, cb) {
    var self = this;
    process.nextTick(function() {
      for (var i = 0, len = self.accessList.length; i < len; i++) {
        var record = self.accessList[i];
        record.id = i + 1;
        if (record.login === username) {
          return cb(null, record);
        }
      }
      return cb(null, null);
    });
  }
};

module.exports = Access;
