/* global $, Vue, document, JSONEditor, nColumns */
'use strict';

var JSONEditorOptions = { mode: "code" };
var pc = require("paperclip/lib/node.js");


var view = function(id, mdl) {
  var n = document.getElementById(id)
  var t = n.innerHTML.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
  var v = pc.template(t, pc).view(mdl);
  n.parentNode.insertBefore(v.render(), n);
  return v;
}


$(document).ready(function() {
    var oboe = require('oboe');
    var nTables = 0;


    var viewPage = view('modal-edit-page', {
        handleSave : function(event) {
          var idPage = document.location.pathname.replace(/\/+$/,'').split('/').slice(1).shift();
          var url = String('/-/v3/settab/').concat(idPage).concat('/');
          var form = {
            "name": viewPage.get('_wid'),
            "template" :  $('#modal-editpage-input-template').summernote('code')
          };
          console.log('form', form);
          $.ajax({
              type: "POST",
              url: url,
              data: form,
              success: function(data) {
                document.location.href = document.location.pathname.replace(/\/+$/,'').concat('/');
              }
          });
          return false;
        },
    });



    $('#modal-editpage').on('show.bs.modal', function (e) {
        var idPage = document.location.pathname.replace(/\/+$/,'').split('/').slice(1).shift();
        oboe(window.location.protocol + '//' + window.location.host + '/index/' + idPage +'/*?alt=raw').done(function(items) {
            viewPage.set('_wid', items[0]._wid);
            console.log('items', items[0]);
            $('#modal-editpage-input-template').summernote({
                height: 200,
                toolbar: [
                  ['g1', ['style', 'fontname', 'fontsize']],
                  ['g2', ['bold', 'italic', 'underline', 'color']],
                  ['g3', ['clear']],
                  ['g4', ['paragraph', 'height', 'ol', 'ul', ]],
                  ['g5', ['strikethrough', 'superscript', 'subscript']],
                  ['g6', ['link', 'hr', 'picture', 'table']]
                ]
              });
              $('#modal-editpage-input-template').summernote('code', items[0]._template);
        });
    });

});
