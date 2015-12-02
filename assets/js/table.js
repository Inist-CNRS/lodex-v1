/* global $, document, JSONEditor, nColumns */
'use strict';
var JSONEditorOptions = { mode: "code" };
var pc = require("paperclip/lib/node.js");

pc.modifiers.get = function (input, key) {
  return input[key];
};
pc.modifiers.len = function (input, key) {
  if (key !== undefined) {
    input = input[key]
  }
  if (input === null || input === undefined) {
    return  0;
  }
  else if (typeof input.length === 'number') {
    return input.length;
  }
  else {
    return 0;
  }
};
pc.modifiers.plus = function (input, nb) {
  if (nb === undefined) {
    nb = 1
  }
  return parseInt(input) + parseInt(nb);
};

var view = function(id, cb, mdl) {
  if (typeof cb !== 'function') {
    mdl = cb;
  }
  var n = document.getElementById(id)
  var t = n.innerHTML.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
  var v = pc.template(t, pc).view(mdl);
  n.parentNode.insertBefore(v.render(), n);
  if (typeof cb === 'function') {
    setTimeout(cb, 0);
  }
  return v;
}

$(document).ready(function() {
    var oboe = require('oboe');
    var JURL = require('url');
    var nTables = 0;

    var je1, je2, je3, je4, je5;

    // {{{ VIEWS
    var viewList = view('table-items-list', function() {
        viewList.reload = function() {
          var url = JURL.parse(viewList.get('url'));
          url.query = {
            "orderby" : viewSort.get('field') + ' '+  viewSort.get('order')
          }
          viewList.set('items', []);
          oboe(JURL.format(url))
          .node('!.*', function(item) {
              var items = viewList.get('items');
              items.push(item);
              viewList.set('items', items);
          })
          .done(function(items) {
              $("#table-items table").resizableColumns();
          });
        }
        viewList.reload();
      },
      {
        url :  window.location.href.replace(/\/+$/,'') + '/*',
        items: []
      }
    );

    var viewRoot = view('div-set-root', function() {
        oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/,'') +'/*?alt=raw').done(function(items) {
            viewRoot.set('isRoot', items[0]._root || false);
        });
      },
      {
        isRoot: false,
        handleToggle: function(event) {
          var idt = document.location.pathname.replace(/\/+$/,'').slice(1);
          var url = '/-/setroot/';
          var form = {
            "origin": idt,
            "isRoot": viewRoot.get('isRoot')
          };
          if (form.isRoot) {
            $.ajax({
                type: "POST",
                url: url,
                data: form,
                error: console.error
            });
          }
          else {
            viewRoot.set('isRoot', true);
          }
          return false;
        }
    });

    var viewSort = view('div-sort-by', function() { },
      {
        field: '_id',
        order: 'asc',
        handleChange: function(event) {
          viewSort.set($(this).attr('name'), $(this).val())
          viewList.reload();
          return false;
        }
    });




    var viewTable = view('modal-edit-table', function() {
        $('#modal-edittable-input-description').summernote({
            height: 200,
            dialogsInBody: true,
            toolbar: [
              ['g2', ['bold', 'italic', 'underline', 'color']],
              ['g3', ['clear']],
            ]
          });
          $("#modal-edittable").on("show.bs.modal", function() {
              oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/,'') +'/*?alt=raw').done(function(items) {
                  viewTable.set('title', items[0]._label);
                  viewTable.set('_wid', items[0]._wid);
                  je1.set(items[0]._label);
                  je2.set(items[0]._text);
                  je3.set(items[0]._hash);
                  console.log('items', items[0]);
                  $("#modal-edittable-input-description").summernote('code', items[0]._text);
                  viewRoot.set('isRoot', items[0]._root || false);
              });
          });
        }, {
          handleSave : function(event) {
            var url = '/-/v3/settab' + document.location.pathname.replace(/\/+$/,'').concat('/');
            var form = {
              "name": viewTable.get('_wid'),
              "title": viewTable.get('title'),
              "description" :  $("#modal-edittable-input-description").summernote("code")
            };
            $.ajax({
                type: "POST",
                url: url,
                data: form,
                success: function(data) {
                  document.location.href = "/";
                }
            });
            return false;
          },
          handleDrop: function(event) {
            var url = '/-/v3/settab' + document.location.pathname.replace(/\/+$/,'').concat('/');
            var form = {};
            form[document.location.pathname.replace(/^\/+/, '').replace(/\/$/, '')] = true;
            $.ajax({
                type: "POST",
                url: url ,
                data: form,
                success: function(data) {
                  document.location.href = "/";
                }
            });
            return false;
          }
      });


      var viewColumn = view('modal-edit-column', {
          handleSave : function(event) {
            var idColumn = viewColumn.get('name');
            //var type = $("#modal-editcolumn-tab-list li.active").data('type')
            var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/,'') + '/' + idColumn + '/';
            console.log('form', {
                "previousScheme": viewColumn.get('pscheme'),
                "previousValue" : viewColumn.get('pvalue'),
                "previousName" : viewColumn.get('pname'),
                "previousLabel" : viewColumn.get('plabel'),
                "previousComment" : viewColumn.get('pcomment'),
                "propertyScheme": viewColumn.get('scheme'),
                "propertyValue" : je5.get(),
                "propertyName" : idColumn,
                "propertyLabel" : viewColumn.get('label'),
                "propertyComment" : viewColumn.get('comment')
            });
            $.ajax({
                type: "POST",
                url: url ,
                data: {
                  "previousScheme": viewColumn.get('pscheme'),
                  "previousValue" : viewColumn.get('pvalue'),
                  "previousName" : viewColumn.get('pname'),
                  "previousLabel" : viewColumn.get('plabel'),
                  "previousComment" : viewColumn.get('pcomment'),
                  "propertyScheme": viewColumn.get('scheme'),
                  "propertyValue" : je5.get(),
                  "propertyName" : idColumn,
                  "propertyLabel" : viewColumn.get('label'),
                  "propertyComment" : viewColumn.get('comment')
                },
                success: function(data) {
                  document.location.href = document.location.pathname;
                }
            });
            return false;
          },
          handleDrop: function(event) {
            var idColumn = viewColumn.get('name');
            var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/,'') + '/' + idColumn + '/';
            var form = {};
            form[idColumn] = true;
            $.ajax({
                type: "POST",
                url: url ,
                data: form,
                success: function(data) {
                  document.location.href= document.location.pathname;
                }
            });
            return false;
          }
      });


      var viewLoad = view('modal-load-table', function() {
          viewLoad.set('fileToLoad', '');
        }, {
          handlePrevious: function(event) {
            if (viewLoad.get('typeToLoad') === 'file') {
              $("#modal-loadtable-file").modal('show');
            }
            else if (viewLoad.get('typeToLoad') === 'uri') {
              $("#modal-loadtable-uri").modal('show');
            }
            else if (viewLoad.get('typeToLoad') === 'keyboard') {
              $("#modal-loadtable-keyboard").modal('show');
            }
            else if (viewLoad.get('typeToLoad') === 'fork') {
              $("#modal-loadtable-fork").modal('show');
            }
          },
          handleLoad: function(event) {
            var optData;
            var origin = document.location.pathname.replace(/\/+$/,'').slice(1);
            var typeToLoad = viewLoad.get('typeToLoad');
            console.log('Load', typeToLoad);
            if (formatToLoad === 'json') {
              optData = viewLoadType[typeToLoad].get('jsonPath');
            }
            var formData = {
              loader : formatToLoad,
              keyboard : $('#modal-load-input-keyboard').val(),
              file   : viewLoad.get('fileToLoad'),
              uri    : viewLoadType[typeToLoad].get('source'),
              type   : typeToLoad,
              label  : je1.get(),
              text   : je2.get(),
              hash   : je3.get(),
              enrich : je4.get(),
              origin : origin,
              options: optData
            }
            if (typeToLoad === "fork") {
              var rsc = 't' + (nTables + 1);
              var url = '/-/v3/settab/' + rsc + '/';
              var idt = document.location.pathname.replace(/\/+$/,'').slice(1);
              $.ajax({
                  type: "POST",
                  url: url ,
                  data: {
                    origin: idt
                  },
                  success: function(data) {
                    console.log('Created', data);
                    formData['uri'] = '/' + rsc;
                    $.ajax({
                        type: "POST",
                        url: "/-/v3/load",
                        data: formData,
                        success: function(data) {
                          document.location.href = formData['uri'];
                        }
                    });
                  },
                  error: console.error
              });
            }
            if (formData[formData.type] === undefined || formData[formData.type] === '') {
              return false;
            }
            $.ajax({
                type: "POST",
                url: "/-/v3/load",
                data: formData,
                success: function(data) {
                  document.location.href= document.location.pathname;
                }
            });
            viewLoad.get('fileToLoad');
            return false;
          }
      });

      var viewPage = view('modal-edit-page', function() {
          $('#modal-editpage').on('show.bs.modal', function (e) {
              var idPage = document.location.pathname.replace(/\/+$/,'').split('/').slice(1).shift();
              oboe(window.location.protocol + '//' + window.location.host + '/index/' + idPage +'/*?alt=raw').done(function(items) {
                  viewPage.set('_wid', items[0]._wid);
                  console.log('items', items[0]);
                  $('#modal-editpage-input-template').summernote({
                      height: 200,
                      dialogsInBody: true,
                      toolbar: [
                        ['g1', ['style', 'fontname', 'fontsize']],
                        ['g2', ['bold', 'italic', 'underline', 'color']],
                        ['g3', ['clear']],
                        ['g4', ['paragraph', 'height', 'ol', 'ul', ]],
                        ['g5', ['strikethrough', 'superscript', 'subscript']],
                        ['g6', ['link', 'hr', 'picture', 'table']],
                        ['g7', ['codeview', 'fullscreen']],
                      ]
                  });
                  $('#modal-editpage-input-template').summernote('code', items[0]._template);
              });
          });
          $('#modal-editpage').on('hidden.bs.modal', function (e) {
              if(e.target.id != 'modal-editpage') { // ignore events which are raised from child modals
                alert('ignore', e.target.id);
                return false;
              }
              else {
                return true;
              }
              // your code
          });
        },{
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



      var viewLoadType = {};
      viewLoadType['file'] = view('modal-load-table-file', {
          handleSelect: function(event) {
            $('#modal-load-input-filename').click();
          }
      });
      viewLoadType['uri'] = view('modal-load-table-uri', { });
      viewLoadType['keyboard'] = view('modal-load-table-keyboard', { });
      viewLoadType['fork'] = view('modal-load-table-fork', { });
      // }}}



      oboe(window.location.protocol + '//' + window.location.host + '/index/$count').done(function(items) {
          nTables = items[0].value;
      })


      je1 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-label"), JSONEditorOptions);
      je2 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-text"), JSONEditorOptions);
      je3 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-hash"), JSONEditorOptions);
      je4 = new JSONEditor(document.getElementById("modal-forktable-enrich"), JSONEditorOptions);
      je5 = new JSONEditor(document.getElementById("modal-editcolumn-jsoneditor-value"), JSONEditorOptions);

      $('#modal-load-input-filename').change(function() {
          var t = $(this).val();
          $('#modal-load-input-file').val(t);
      });
      $('#modal-load-input-filename').fileupload({
          dataType: 'json',
          send:  function (e, data) {
            $('#modal-load-input-file-label').hide(4, function() {
                $('#modal-load-input-file-indicator').show().html('0%');
            });
          },
          done: function (error, data) {
            if (Array.isArray(data.result) && data.result[0]) {
              viewLoad.set('fileToLoad', data.result[0]);
            }
            $('#modal-load-input-file-indicator').html('100%');
            $('#modal-load-tab-file > div').addClass("has-success has-feedback");
            $('#modal-load-tab-file .form-control-feedback').show();
            setTimeout(function() {
                $('#modal-load-input-file-indicator').hide(4, function() {
                    $('#modal-load-input-file-label').show();
                });
            }, 2500);
          },
          progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#modal-load-input-file-indicator').html(progress + '%');
          }
      });


      $('.action-editcolumn').click(function (e) {
          var column = $(this).data("column");
          oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/,'') +'/*?alt=raw').done(function(items) {
              console.log('items', items[0]);
              viewColumn.set('plabel', items[0]._columns[column].label);
              viewColumn.set('label', items[0]._columns[column].label);

              viewColumn.set('pname', column);
              viewColumn.set('name', column);

              viewColumn.set('pscheme', items[0]._columns[column].scheme);
              viewColumn.set('scheme', items[0]._columns[column].scheme);

              viewColumn.set('ptype', items[0]._columns[column].type);
              viewColumn.set('type', items[0]._columns[column].type);

              viewColumn.set('pcomment', items[0]._columns[column].comment);
              viewColumn.set('comment', items[0]._columns[column].comment);

              delete items[0]._columns[column].label;
              delete items[0]._columns[column].comment;
              delete items[0]._columns[column].type;
              delete items[0]._columns[column].scheme;
              console.log('items', items[0]._columns[column]);
              viewColumn.set('pvalue', items[0]._columns[column]);
              je5.set(items[0]._columns[column]);
          });
      });



      // {{{ LOAD
      $("#modal-loadtable-file").on("show.bs.modal", function() {
          $(".modal-load-options").hide();
          viewLoad.set('typeToLoad', 'file');
      });
      $("#modal-loadtable-uri").on("show.bs.modal", function() {
          $(".modal-load-options").hide();
          viewLoad.set('typeToLoad', 'uri');
      });
      $("#modal-loadtable-keyboard").on("show.bs.modal", function() {
          $(".modal-load-options").hide();
          viewLoad.set('typeToLoad', 'keyboard');
      });
      $("#modal-loadtable-fork").on("show.bs.modal", function() {
          $(".modal-load-options").hide();
          viewLoad.set('typeToLoad', 'fork');
      });

      $(".modal-loadtable").on("show.bs.modal", function() {
          $("#modal-loadtable").modal('hide');
      })
      $("#modal-loadtable").on("show.bs.modal", function() {
          $("#modal-loadtable-file").modal('hide');
          $("#modal-loadtable-uri").modal('hide');
          $("#modal-loadtable-keyboard").modal('hide');
          $("#modal-loadtable-fork").modal('hide');
      });
      var formatToLoad;
      $("select.modal-load-shared-type" ).change(function () {
          $(".modal-load-options").hide();
          $("option:selected", this ).each(function() {
              formatToLoad = $( this ).val();
              $(".modal-load-options-"+formatToLoad).show();
          });
      })
      .change();
      $("#modal-load-previous").click(function() { });
      // }}}

      // {{{ MENU
      $('#action-newtable').click(function() {
          var rsc = 't' + (nTables + 1);
          var url = '/-/v3/settab/' + rsc + '/';
          $.ajax({
              type: "POST",
              url: url ,
              data: {},
              success: function(data) {
                document.location.href = '/' + rsc;
              }
          });
          return false;
      });
      $('#action-clonetable').click(function() {
          var rsc = 't' + (nTables + 1);
          var url = '/-/v3/settab/' + rsc + '/';
          var idt = document.location.pathname.replace(/\/+$/,'').slice(1);
          $.ajax({
              type: "POST",
              url: url,
              data: {
                origin: idt
              },
              success: function(data) {
                document.location.href = '/' + rsc;
              }
          });
          return false;
      });
      $('#action-droptable').click(function() {
          alert('Not yet implemented');
          return false;
      });
      $('#action-newcolumn').click(function() {
          var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/,'') + '/c' + (nColumns + 1) + '/';
          $.ajax({
              type: "POST",
              url: url ,
              data: {},
              success: function(data) {
                document.location.href= document.location.pathname;
              }
          });
          return false;
      });
      $('#action-setroot').click(function() {
          return false;
      });

      $('#action-download-csv').click(function() {
          document.location.href = document.location.pathname.replace(/\/+$/,'') + '/*/?alt=csv';
          return false;
      });
      $('#action-download-nq').click(function() {
          document.location.href = document.location.pathname.replace(/\/+$/,'') + '/*/?alt=nq';
          return false;
      });
      $('#action-download-json').click(function() {
          document.location.href = document.location.pathname.replace(/\/+$/,'') + '/*/?alt=json';
          return false;
      });
      // }}}



      $(".modal").on("show.bs.modal", function() {
          var height = $(window).height() / 2;
          $(this).find(".modal-body").css("min-height", Math.round(height));
      });


  });

