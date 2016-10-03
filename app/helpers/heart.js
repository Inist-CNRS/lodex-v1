'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:helpers:' + basename)
  , util = require('util')
  , heartbeats = require('heartbeats')
  ;

var heart;

module.exports = function (heartrate) {

  if (heart === undefined) {
    heart = new heartbeats.Heart(1000);
  }
  if (heartrate !== undefined && typeof heartrate === 'number') {
    heart.setHeartrate(heartrate);
  }
  return heart;
}
