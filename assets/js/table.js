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
  else {
    return input.length;
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
    var nTables = 0;

    var je1, je2, je3, je4, je5;

    // {{{ VIEWS
    var viewList = view('table-items-list', function() {
        oboe(window.location.href.replace(/\/+$/,'') + '/*')
        .node('!.*', function(item) {
            var items = viewList.get('items');
            items.push(item);
            viewList.set('items', items);
        })
        .done(function(items) {
            $("#table-items table").resizableColumns();
        });
      },
      {
        items: []
    });

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



    var viewTable = view('modal-edit-table', function() {
        $('#modal-edittable-input-description').summernote({
            height: 200,
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
          else if (viewLoad.get('typeToLoad') === 'text') {
            $("#modal-loadtable-keyboard").modal('show');
          }
          else if (viewLoad.get('typeToLoad') === 'fork') {
            $("#modal-loadtable-fork").modal('show');
          }
        },
        handleLoad: function(event) {
          var formData = {
            loader : formatToLoad,
            keyboard : $('#modal-load-input-keyboard').val(),
            file   : viewLoad.get('fileToLoad'),
            uri    : $("#modal-load-input-uri").val(),
            type   : viewLoad.get('typeToLoad'),
            label  : je1.get(),
            text   : je2.get(),
            hash   : je3.get(),
            xtend  : je4.get(),
            origin : document.location.pathname.replace(/\/+$/,'').slice(1)
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


    var viewLoadFile = view('modal-load-table-file', {
        handleSelect: function(event) {
          $('#modal-load-input-filename').click();
        }
    });
    var viewLoadUri = view('modal-load-table-uri', { });
    var viewLoadKeyboard = view('modal-load-table-keyboard', { });
    var viewLoadFork = view('modal-load-table-fork', { });
    // }}}



    oboe(window.location.protocol + '//' + window.location.host + '/index/$count').done(function(items) {
        nTables = items[0].value;
    })


    je1 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-label"), JSONEditorOptions);
    je2 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-text"), JSONEditorOptions);
    je3 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-hash"), JSONEditorOptions);
    je4 = new JSONEditor(document.getElementById("modal-forktable-extend"), JSONEditorOptions);
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
        viewLoad.set('typeToLoad', 'file');
    });
    $("#modal-loadtable-uri").on("show.bs.modal", function() {
        viewLoad.set('typeToLoad', 'uri');
    });
    $("#modal-loadtable-keyboard").on("show.bs.modal", function() {
        viewLoad.set('typeToLoad', 'text');
    });
    $("#modal-loadtable-fork").on("show.bs.modal", function() {
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
        $( "option:selected", this ).each(function() {
            formatToLoad = $( this ).val();
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

