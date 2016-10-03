'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:helpers:' + basename)
  , traverse = require('traverse')
  ;
function revive (x) {
  if (typeof x === 'string') {
    if (x.slice(-2) === '^N') {
      this.update(Number(x.slice(0, -2)));
    }
    else if (x.slice(-2) === '^D') {
      this.update(new Date(Number(x.slice(0, -2))));
    }
    else if (x.slice(-2) === '^B') {
      this.update(Boolean(Number(x.slice(0, -2))));
    }
  }
}
module.exports = function mq(qry, key, def) {
  var res;
  if (qry[key] !== undefined) {
    res = qry[key];
    traverse(res).forEach(revive);
  }
  else {
    res = def;
  }
  // debug('mongoQuery from', qry, 'search', key, 'found', qry[key], 'return', res);
  return res;
}

