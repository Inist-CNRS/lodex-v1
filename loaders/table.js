'use strict';
var URL = require('url')
;
var randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = function(options) {
  options = options || {};
  return function (input, submit) {
    var loc = URL.parse(input.location, true);
    var nid = randomInt(0, 9007199254740991);
    input._wid = 't' + nid;
    input._content = {
      json : loc.query
<<<<<<< a1bb051f4e79891a6e012192167f6bbd9021e2cc
    };
=======
    }
    console.log('loc', loc);
    console.log('input', input);

>>>>>>> send _ref to setpage
    submit(null, input);
  };
};
