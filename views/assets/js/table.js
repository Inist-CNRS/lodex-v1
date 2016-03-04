/* global $, document, JSONEditor, nColumns, view */
(function() {
  'use strict';

  $(document).ready(function() {
    var JSONEditorOptions = { mode: "code", maxLines: Infinity };
    var oboe = require('oboe');
    var JURL = require('url');
    var nTables = 0;

    var je0, je1, je2, je3, je4, je5;

    /**
     * View
     *
     */
    var viewLoomInternal = view('template-modal-loom-internal', function() {
      var url = JURL.parse(window.location.href.replace(/\/+$/, ''));
      url.pathname = url.path = '/index/*';
      viewLoomInternal.set('items', []);
      viewLoomInternal.set('rightTable', document.location.pathname.replace(/\/+$/, '').split('/').slice(1).shift());
      viewLoomInternal.set('leftTable', document.location.pathname.replace(/\/+$/, '').replace(/^\/+/, ''));
      oboe(JURL.format(url))
      .node('!.*', function(item) {
        var items = viewLoomInternal.get('items');
        items.push(item);
        viewLoomInternal.set('items', items);
      });
      $("#modal-loom-internal-select").change(function() {
        $("option:selected", this).each(function() {
          viewLoomInternal.set('rightTable', $(this).data('value'));
        });
      })
    });



    /**
     * View
     *
     */
    var viewLoom = view('template-modal-loom', function() {
      $(".modal-loom").on("show.bs.modal", function() {
        $("#modal-loom").modal('hide');
      });
      $("#modal-loom").on("show.bs.modal", function() {
        var height = $(window).height() / 2;
        $(".modal-column").css("max-height", Math.round(height));
        $("#modal-loom-internal").modal('hide');


        var url = JURL.parse(window.location.href);

        viewLoom.set('leftColumns', []);
        url.pathname = String('/index/').concat(viewLoomInternal.get('leftTable')).concat('/*');
        url.query = { "alt": "raw" };
        oboe(JURL.format(url)).done(function(items) {
          var cols = Object.keys(items[0]._columns).map(function(x) {
            return { value: x, label: items[0]._columns[x].label } });
          viewLoom.set('leftColumnName', cols[0].value);
          viewLoom.set('leftColumns', cols)
        });

        viewLoom.set('rightColumns', []);
        url.pathname = String('/index/').concat(viewLoomInternal.get('rightTable')).concat('/*');
        url.query = { "alt": "raw" };
        oboe(JURL.format(url)).done(function(items) {
          var cols = Object.keys(items[0]._columns).map(function(x) {
            return { value: x, label: items[0]._columns[x].label } });
          viewLoom.set('rightColumnName', cols[0].value);
          viewLoom.set('rightColumns', cols)
        });

        viewLoom.reloadRight = function() {
          viewLoom.set('rightItems', []);
          var url = JURL.parse(window.location.href);
          url.pathname = String('/').concat(viewLoomInternal.get('rightTable')).concat('/*');
          oboe(JURL.format(url))
            .node('!.*', function(item) {
              var name = viewLoom.get('rightColumnName');
              var items = viewLoom.get('rightItems');
              items.push(item[name]);
              viewLoom.set('rightItems', items);
            });
        }
        viewLoom.reloadRight();


        viewLoom.reloadLeft = function() {
          viewLoom.set('leftItems', []);
          var url = JURL.parse(window.location.href);
          url.pathname = String('/').concat(viewLoomInternal.get('leftTable')).concat('/*');
          oboe(JURL.format(url))
          .node('!.*', function(item) {
            var name = viewLoom.get('leftColumnName');
            var items = viewLoom.get('leftItems');
            items.push(item[name]);
            viewLoom.set('leftItems', items);
          });
        }
        viewLoom.reloadLeft();

      });
    }, {
      handleChangeLeft: function(event) {
        viewLoom.set('leftColumnName', $(this).find(":selected").data('value'));
        viewLoom.reloadLeft();
        return false;
      },
      handleChangeRight: function(event) {
        viewLoom.set('rightColumnName', $(this).find(":selected").data('value'));
        viewLoom.reloadRight();
        return false;
      }

    });



    /**
     * View
     *
     */
    var viewList = view('template-table-items-list', function() {
      viewList.reload = function() {
        viewList.set('page', 1);
        viewList.set('items', []);
        viewList.load();
      }
      viewList.load = function() {
        var first = true;
        var url = JURL.parse(viewList.get('url'));
        var limit = 30;
        var page = Number(viewList.get('page'));
        page = Number.isNaN(page) ? 1 : page;
        var offset = limit * (page - 1)
        url.query = {
          "orderby": viewSort.get('field') + ' ' + viewSort.get('order'),
          "limit": String(offset).concat(',').concat(String(limit))
        }
        oboe(JURL.format(url))
        .node('!.*', function(item) {
          var items = viewList.get('items');
          items.push(item);
          viewList.set('items', items);
          if (first) {
            // viewColumn.set('sampleURL', encodeURIComponent(window.location.href.replace(/\/+$/,'').concat('/').concat(item._wid).concat('/*?alt=raw&firstOnly=1')));
            viewColumn.set('sampleURL', window.location.href.replace(/\/+$/, '').concat('/').concat(item._wid).concat('/*?alt=raw&firstOnly=1'));
            viewColumn.set('sampleStylesheet', encodeURIComponent(JSON.stringify({})));
            first = false;
          }
        })
        .done(function(items) {
          $("#table-items table").resizableColumns();
        });
      }
      viewList.reload();
      $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
          viewList.set('page', viewList.get('page') + 1);
          viewList.load()
        }
      });
    }, {
      page: 1,
      url: window.location.href.replace(/\/+$/, '') + '/*',
      items: []
    });


    /**
     * View
     *
     */
    var viewRoot = view('template-div-set-root', function() {
      oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/, '') + '/*?alt=raw').done(function(items) {
        viewRoot.set('isRoot', items[0]._root ||  false);
      });
    }, {
      isRoot: false,
      handleToggle: function(event) {
        var idt = document.location.pathname.replace(/\/+$/, '').slice(1);
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

    /**
     * View
     *
     */
    var viewSort = view('template-div-sort-by', function() {}, {
      field: '_id',
      order: 'asc',
      handleChange: function(event) {
        viewSort.set($(this).attr('name'), $(this).val())
        viewList.reload();
        return false;
      }
    });



    /**
     * View
     *
     */
    var viewTable = view('template-modal-edit-table', function() {
      $('#modal-edittable-input-description').summernote({
        height: 200,
        dialogsInBody: true,
        toolbar: [
          ['g2', ['bold', 'italic', 'underline', 'color']],
          ['g3', ['clear']],
        ]
      });
      $("#modal-edittable").on("show.bs.modal", function() {
        oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/, '') + '/*?alt=raw').done(function(items) {
          viewTable.set('title', items[0]._label);
          viewTable.set('_wid', items[0]._wid);
          je0.set(items[0]._reskey);
          je1.set(items[0]._label);
          je2.set(items[0]._text);
          je3.set(items[0]._hash);
          $("#modal-edittable-input-description").summernote('code', items[0]._text);
          viewRoot.set('isRoot', items[0]._root ||  false);
        });
      });
    }, {
      handleSave: function(event) {
        var url = '/-/v3/settab' + document.location.pathname.replace(/\/+$/, '').concat('/');
        var form = {
          "name": viewTable.get('_wid'),
          "title": viewTable.get('title'),
          "description": $("#modal-edittable-input-description").summernote("code")
        };
        $.ajax({
          type: "POST",
          url: url,
          data: form,
          success: function(data) {
            document.location.href = String('/').concat(form.name);
          }
        });
        return false;
      },
      handleDrop: function(event) {
        var url = '/-/v3/settab' + document.location.pathname.replace(/\/+$/, '').concat('/');
        var form = {};
        form[document.location.pathname.replace(/^\/+/, '').replace(/\/$/, '')] = true;
        $.ajax({
          type: "POST",
          url: url,
          data: form,
          success: function(data) {
            document.location.href = "/";
          }
        });
        return false;
      }
    });


    /**
     * View
     *
     */
    var viewColumn = view('template-modal-edit-column', function() {

      $.fn.modal.Constructor.prototype.enforceFocus = function() {}; // @see https://github.com/select2/select2/issues/1436
      $("#modal-editcolumn-input-scheme").select2({
        theme: "bootstrap",
        width: null,
        placeholder: {
          id: "-1",
          text: "Select an scheme..."
        },
        minimumInputLength: 2,
        ajax: {
          url: "http://lov.okfn.org/dataset/lov/api/v2/term/search",
          dataType: 'json',
          delay: 250,
          data: function(params) {
            return {
              q: params.term,
              page: params.page,
              type: 'property'
            };
          },
          processResults: function(data, params) {
            params.page = params.page || 1;
            // @see http://stackoverflow.com/questions/29035717/select2-load-data-using-ajax-cannot-select-any-option/29082217#29082217
            var select2Data = $.map(data.results, function(obj) {
              obj.id = Array.isArray(obj.uri) ? obj.uri.pop() : '?';
              obj.text = obj.prefixedName;
              return obj;
            });
            return {
              results: select2Data,
              pagination: {
                more: (params.page * 30) < data.total_results
              }
            };
          }
        },
        escapeMarkup: function(markup) { return markup; },
        templateResult: function(row) {
          if (row.loading) {
            return row.text;
          }
          var markup = "<div>";
          markup += "<div>" + row.text + "</div>";
          markup += "<small>" + row.id + "</small>";
          markup += "</div>";
          return markup;
        },
        templateSelection: function(row) {
          return row.id;
        }
      }).change(function() {
        viewColumn.set('scheme', $("#modal-editcolumn-input-scheme").val());
      });


      var lang = [];
      var userLang = navigator.language ? navigator.language.substr(0,2) : "en";
      oboe(window.location.protocol + '//' + window.location.host + '/assets/js/lang.json')
      .node("!.*", function(l) {
        var o = {
          id:   l.code,
          text: l.prefLabels[userLang]
        }
        lang.push(o);
      })
      .done(function(iso6391) {

        $("#modal-editcolumn-input-language")
        .select2({
          data: lang,
          theme: "bootstrap",
          width: "100%"
        })
        .change(function() {
          viewColumn.set('language', $("#modal-editcolumn-input-language").val());
        });

      })
      .fail(function(e) {
        console.error(e);
      });



    }, {
      sampleURL: '',
      handleSave: function(event) {
        var idColumn = viewColumn.get('name');
        //var type = $("#modal-editcolumn-tab-list li.active").data('type')
        var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/, '') + '/' + idColumn + '/';

        console.log('before', {
          "previousScheme"  : viewColumn.get('pscheme'),
          "previousValue"   : viewColumn.get('pvalue'),
          "previousName"    : viewColumn.get('pname'),
          "previousLabel"   : viewColumn.get('plabel'),
          "previousLanguage": viewColumn.get('planguage'),
          "previousPrimary" : viewColumn.get('pprimary'),
          "previousComment" : viewColumn.get('pcomment')
        });
        console.log('after', {
          "propertyScheme": $("#modal-editcolumn-input-scheme").val(),
          "propertyValue"   : je5.get(),
          "propertyName"    : idColumn,
          "propertyLabel"   : viewColumn.get('label'),
          "propertyLanguage": viewColumn.get('language'),
          "propertyPrimary" : viewColumn.get('primary'),
          "propertyComment" : viewColumn.get('comment')
        });

        $.ajax({
          type: "POST",
          url: url,
          data: {
            "previousScheme"  : viewColumn.get('pscheme'),
            "previousValue"   : viewColumn.get('pvalue'),
            "previousName"    : viewColumn.get('pname'),
            "previousLabel"   : viewColumn.get('plabel'),
            "previousLanguage": viewColumn.get('planguage'),
            "previousPrimary" : viewColumn.get('pprimary'),
            "previousComment" : viewColumn.get('pcomment'),
            "propertyScheme"  : $("#modal-editcolumn-input-scheme").val(),
            "propertyValue"   : je5.get(),
            "propertyName"    : idColumn,
            "propertyLabel"   : viewColumn.get('label'),
            "propertyLanguage": viewColumn.get('language'),
            "propertyPrimary" : viewColumn.get('primary'),
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
        var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/, '') + '/' + idColumn + '/';
        var form = {};
        form[idColumn] = true;
        $.ajax({
          type: "POST",
          url: url,
          data: form,
          success: function(data) {
            document.location.href = document.location.pathname;
          }
        });
        return false;
      },
      handleCrown: function(event) {
        je0.set(je5.get());
        viewLoad.set('typeToLoad', 'fork');
        $("#modal-editcolumn").modal('hide');
        $("#modal-loadtable").modal('show');
      }
    });


    /**
     * View
     *
     */
    var viewLoad = view('template-modal-load-table', function() {
      viewLoad.set('fileToLoad', '');
      $(".modal-loadtable").on("show.bs.modal", function() {
        $("#modal-loadtable").modal('hide');
      })
      $("#modal-loadtable").on("show.bs.modal", function() {
        $("#modal-loadtable-file").modal('hide');
        $("#modal-loadtable-uri").modal('hide');
        $("#modal-loadtable-keyboard").modal('hide');
        $("#modal-loadtable-fork").modal('hide');
      });
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
        var origin = document.location.pathname.replace(/\/+$/, '').slice(1);
        var typeToLoad = viewLoad.get('typeToLoad');
        if (formatToLoad === 'json') {
          optData = viewLoadType[typeToLoad].get('jsonPath');
        }
        var formData = {
          loader  : formatToLoad,
          keyboard: $('#modal-load-input-keyboard').val(),
          file    : viewLoad.get('fileToLoad'),
          uri     : viewLoadType[typeToLoad].get('source'),
          type    : typeToLoad,
          reskey  : je0.get(),
          label   : je1.get(),
          text    : je2.get(),
          hash    : je3.get(),
          enrich  : je4.get(),
          origin  : origin,
          options : optData
        }
        if (typeToLoad === "fork") {
          var rsc = 't' + (nTables + 1);
          var url = '/-/v3/settab/' + rsc + '/';
          var idt = document.location.pathname.replace(/\/+$/, '').slice(1);
          $.ajax({
            type: "POST",
            url: url,
            data: {
              origin: idt
            },
            success: function(data) {
              formData.uri = '/' + rsc;
              $.ajax({
                type: "POST",
                url: "/-/v3/load",
                data: formData,
                success: function(data) {
                  document.location.href = formData.uri;
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
            document.location.href = document.location.pathname;
          }
        });
        viewLoad.get('fileToLoad');
        return false;
      }
    });



    /**
     * View
     *
     */
    var viewPage = view('template-modal-edit-page', function() {
      $('#modal-editpage').on('show.bs.modal', function(e) {
        var idPage = document.location.pathname.replace(/\/+$/, '').split('/').slice(1).shift();
        oboe(window.location.protocol + '//' + window.location.host + '/index/' + idPage + '/*?alt=raw').done(function(items) {
          viewPage.set('_wid', items[0]._wid);
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
      $('#modal-editpage').on('hidden.bs.modal', function(e) {
        if (e.target.id != 'modal-editpage') { // ignore events which are raised from child modals
          alert('ignore', e.target.id);
          return false;
        } else {
          return true;
        }
        // your code
      });
    }, {
      handleSave: function(event) {
        var idPage = document.location.pathname.replace(/\/+$/, '').split('/').slice(1).shift();
        var url = String('/-/v3/settab/').concat(idPage).concat('/');
        var form = {
          "name": viewPage.get('_wid'),
          "template": $('#modal-editpage-input-template').summernote('code')
        };
        $.ajax({
          type: "POST",
          url: url,
          data: form,
          success: function(data) {
            document.location.href = document.location.pathname.replace(/\/+$/, '').concat('/');
          }
        });
        return false;
      },
    });



    var viewLoadType = {};
    /**
     * View
     *
     */
    viewLoadType.file = view('template-modal-load-table-file', function() {
      $('#modal-load-input-filename').change(function() {
        var t = $(this).val();
        $('#modal-load-input-file').val(t);
      });
      $('#modal-load-input-filename').fileupload({
        dataType: 'json',
        send: function(e, data) {
          $('#modal-load-input-file-label').hide(4, function() {
            $('#modal-load-input-file-indicator').show().html('0%');
          });
        },
        done: function(error, data) {
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
        progressall: function(e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#modal-load-input-file-indicator').html(progress + '%');
        }
      });
      $("#modal-loadtable-file").on("show.bs.modal", function() {
        $(".modal-load-options").hide();
        viewLoad.set('typeToLoad', 'file');
      });
    }, {
      handleSelect: function(event) {
        $('#modal-load-input-filename').click();
      }
    });



    /**
     * View
     *
     */
    viewLoadType.uri = view('template-modal-load-table-uri', function() {
      $("#modal-loadtable-uri").on("show.bs.modal", function() {
        $(".modal-load-options").hide();
        viewLoad.set('typeToLoad', 'uri');
      });
    });


    /**
     * View
     *
     */
    viewLoadType.keyboard = view('template-modal-load-table-keyboard', function() {
      $("#modal-loadtable-keyboard").on("show.bs.modal", function() {
        $(".modal-load-options").hide();
        viewLoad.set('typeToLoad', 'keyboard');
      });
    });


    /**
     * View
     *
     */
    viewLoadType.fork = view('template-modal-load-table-fork', function() {
      $("#modal-loadtable-fork").on("show.bs.modal", function() {
        $(".modal-load-options").hide();
        viewLoad.set('typeToLoad', 'fork');
      });
    });





    /**
     * Fill variables
     *
     */
    oboe(window.location.protocol + '//' + window.location.host + '/index/$count').done(function(items) {
      nTables = items[0].value;
    })

    je0 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-reskey"), JSONEditorOptions);
    je1 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-label"), JSONEditorOptions);
    je2 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-text"), JSONEditorOptions);
    je3 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-hash"), JSONEditorOptions);
    je4 = new JSONEditor(document.getElementById("modal-forktable-enrich"), JSONEditorOptions);
    je5 = new JSONEditor(document.getElementById("modal-editcolumn-jsoneditor-value"), JSONEditorOptions);


    /**
     * Action
     *
     */
    $('.action-editcolumn').click(function(e) {
      var column = $(this).data("column");
      oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/, '') + '/*?alt=raw').done(function(items) {
        viewColumn.set('plabel', items[0]._columns[column].label);
        viewColumn.set('label', items[0]._columns[column].label);

        viewColumn.set('pname', column);
        viewColumn.set('name', column);

        viewColumn.set('pscheme', items[0]._columns[column].scheme);
        // @see https://stackoverflow.com/questions/30316586/select2-4-0-0-initial-value-with-ajax/30328989#30328989
        var option = $("<option selected></option>").val(items[0]._columns[column].scheme).text(items[0]._columns[column].scheme);
        $("#modal-editcolumn-input-scheme").append(option).trigger("change");

        viewColumn.set('ptype', items[0]._columns[column].type);
        viewColumn.set('type', items[0]._columns[column].type);

        viewColumn.set('pcomment', items[0]._columns[column].comment);
        viewColumn.set('comment', items[0]._columns[column].comment);

        viewColumn.set('planguage', items[0]._columns[column].language);
        viewColumn.set('language', items[0]._columns[column].language);
        $("#modal-editcolumn-input-language").val(viewColumn.get('language')).trigger('change');

        viewColumn.set('pprimary', items[0]._columns[column].primary);
        viewColumn.set('primary', items[0]._columns[column].primary);


        delete items[0]._columns[column].label;
        delete items[0]._columns[column].comment;
        delete items[0]._columns[column].type;
        delete items[0]._columns[column].scheme;
        delete items[0]._columns[column].primary;
        delete items[0]._columns[column].language;
        viewColumn.set('pvalue', items[0]._columns[column]);
        je5.set(items[0]._columns[column]);
      });
    });



    var formatToLoad;
    $("select.modal-load-shared-type").change(function() {
      $(".modal-load-options").hide();
      $("option:selected", this).each(function() {
        formatToLoad = $(this).val();
        $(".modal-load-options-" + formatToLoad).show();
      });
    })

    /**
     * Action
     *
     */
    $('#action-newtable').click(function() {
      var rsc = 't' + (nTables + 1);
      var url = '/-/v3/settab/' + rsc + '/';
      $.ajax({
        type: "POST",
        url: url,
        data: {},
        success: function(data) {
          document.location.href = '/' + rsc;
        }
      });
      return false;
    });


    /**
     * Action
     *
     */
    $('#action-clonetable').click(function() {
      var rsc = 't' + (nTables + 1);
      var url = '/-/v3/settab/' + rsc + '/';
      var idt = document.location.pathname.replace(/\/+$/, '').slice(1);
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


    /**
     * Action
     *
     */
    $('#action-droptable').click(function() {
      alert('Not yet implemented');
      return false;
    });


    /**
     * Action
     *
     */
    $('#action-newcolumn').click(function() {
      var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/, '') + '/c' + (nColumns + 1) + '/';
      $.ajax({
        type: "POST",
        url: url,
        data: {},
        success: function(data) {
          document.location.href = document.location.pathname;
        }
      });
      return false;
    });

    /**
     * Action
     *
     */
    $('#action-setroot').click(function() {
      return false;
    });


    /**
     * Action
     *
     */
    $('#action-download-csv').click(function() {
      document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=csv';
      return false;
    });

    /**
     * Action
     *
     */
    $('#action-download-tsv').click(function() {
      document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=tsv';
      return false;
    });

    /**
     * Action
     *
     */
    $('#action-download-xls').click(function() {
      document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=xls';
      return false;
    });



    /**
     * Action
     *
     */
    $('#action-download-nq').click(function() {
      document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=nq';
      return false;
    });


    /**
     * Action
     *
     */
    $('#action-download-json').click(function() {
      document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=json';
      return false;
    });



    /**
     * Tricks
     *
     */
    $(".modal").on("show.bs.modal", function() {
      var height = $(window).height() / 2;
      $(this).find(".modal-body").css("min-height", Math.round(height));
    });

    $(".jsoneditor", function() {
      $(this).find(".outer").css("padding", 0);
      $(this).find(".outer").css("margin", 0);
    });




  });
}());