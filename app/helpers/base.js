'use strict';

module.exports = function base(dec, base) {
  var len = base.length;
  var ret = '';
  while (dec > 0) {
    ret = base.charAt(dec % len) + ret;
    dec = Math.floor(dec / len);
  }
  return ret;
};
