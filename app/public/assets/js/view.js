/* global document, window */
/*eslint no-unused-vars: "off" */
'use strict';
var JSONEditorOptions = { mode: 'code' };
var pc = require('paperclip/lib/node.js');

pc.modifiers.get = function (input, key) {
  return input[key];
};
pc.modifiers.len = function (input, key) {
  if (key !== undefined) {
    input = input[key];
  }
  if (input === null || input === undefined) {
    return  0;
  }
  else if (typeof input.length === 'number') {
    return input.length;
  }
  return 0;
};
pc.modifiers.plus = function (input, nb) {
  if (nb === undefined) {
    nb = 1;
  }
  return parseInt(input) + parseInt(nb);
};

pc.modifiers.uri = function (input, key) {
  return String(input[key]).replace(window.location.origin, '');
};

var view = function(id, cb, mdl) {
  if (typeof cb !== 'function') {
    mdl = cb;
  }
  if (mdl === undefined) {
    mdl = {};
  }
  var n = document.getElementById(id);
  if (!n) {
    throw new Error('Bad template ID : ' + id);
  }
  var t = n.innerHTML.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
  var v = pc.template(t, pc).view(mdl);
  n.parentNode.insertBefore(v.render(), n);
  if (typeof cb === 'function') {
    setTimeout(cb, 0);
  }
  return v;
};
