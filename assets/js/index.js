/* global $, Vue, document, JSONEditor, paperclip */
'use strict';

paperclip.modifiers.get = function (input, key) {
  return input[key];
};
paperclip.modifiers.len = function (input, key) {
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
paperclip.modifiers.plus = function (input, nb) {
  if (nb === undefined) {
    nb = 1
  }
  return parseInt(input) + parseInt(nb);
};


$(document).ready(function() {
    Vue.config.debug = true;
    var oboe = require('oboe');
    var Faker = require('faker');


    var html = document.getElementById("table-items-template").innerHTML.replace(/\[:/g, '{{').replace(/:\]/g, '}}');
    var template = paperclip.template(html);

    oboe(window.location.href.replace(/\/+$/,'') + '/*').done(function(items) {
        var view = template.view({
            items: items
        });
        document.getElementById("items-tbody").appendChild(view.render());
        $("#table-items table").resizableColumns();
    })
    var EditColumnVue = new Vue( {
        el: '#modal-editcolumn',
        data: {
          "previousScheme": "",
          "previousType": "",
          "previousValue" : {},
          "previousName" : "",
          "previousLabel" : "",
          "previousComment" : "",
          "propertyScheme": "",
          "propertyType": "",
          "propertyValue" : {},
          "propertyName" : "",
          "propertyLabel" : "",
          "propertyComment" : ""
        },
        ready: function() {
          var JSONEditorOptions = { mode: "code" };
          var JSONEditorContainerValue = document.getElementById("modal-editcolumn-jsoneditor-value");
          this.JSONEditorHandleValue = new JSONEditor(JSONEditorContainerValue, JSONEditorOptions);
          var JSONEditorContainerLink= document.getElementById("modal-editcolumn-jsoneditor-link");
          this.JSONEditorHandleLink = new JSONEditor(JSONEditorContainerLink, JSONEditorOptions);
        },
        filters: {
        },
        methods: {
          setField: function (column) {
            var self = this;
            console.log('column', column);
            self.propertyLabel = column.propertyLabel || '';
            self.previousLabel = column.propertyLabel || '';
            self.propertyValue = column.propertyValue || {};
            self.previousValue = column.propertyValue || {};
            self.propertyName = column.propertyName || '';
            self.previousName = column.propertyName || '';
            self.propertyScheme = column.propertyScheme || '';
            self.previousScheme = column.propertyScheme || '';
            self.propertyType= column.propertyType || '';
            self.previousType = column.propertyType || '';
            self.propertyComment = column.propertyComment || '';
            self.previousComment = column.propertyComment || '';
            self.propertyText = column.propertyText || {};
            self.previousText = column.propertyText || {};
            console.log('v', self.propertyValue);
            console.log('t', self.propertyText);
            self.JSONEditorHandleValue.set(self.propertyValue);
            self.JSONEditorHandleLink.set(self.propertyText);
          },
          drop: function() {
            var url = document.location.pathname.replace(/\/+$/,'') + '/*/' + this.propertyName + '/';
            var form = {};
            form[this.propertyName] = true;
            $.ajax({
                type: "POST",
                url: url ,
                data: form,
                success: function(data) {
                  document.location.href= document.location.pathname;
                }
            });
          },
          save : function() {
            this.propertyValue = this.JSONEditorHandleValue.get();
            this.propertyText = this.JSONEditorHandleLink.get();
            this.propertyType = $("#modal-editcolumn-tab-list li.active").data('type')
            var url = document.location.pathname.replace(/\/+$/,'') + '/*/' + this.propertyName + '/';
            $.ajax({
                type: "POST",
                url: url ,
                data: {
                  "previousScheme": this.previousScheme,
                  "previousValue" : this.previousValue,
                  "previousName" : this.previousName,
                  "previousLabel" : this.previousLabel,
                  "previousComment" : this.previousComment,
                  "previousText" : this.previousText,
                  "propertyScheme": this.propertyScheme,
                  "propertyValue" : this.propertyValue,
                  "propertyName" : this.propertyName,
                  "propertyLabel" : this.propertyLabel,
                  "propertyComment" : this.propertyComment,
                  "propertyText" : this.propertyText,
                },
                success: function(data) {
                  document.location.href= document.location.pathname;
                }
            });

          }
        }
      }
    );
    var fileToLoad = '';
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
            fileToLoad = data.result[0];
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
    $('#modal-load-submit').click(function() {
        var formData = {
          loader : $("#modal-load-er").val(),
          text   : $('#modal-load-input-text').val(),
          file   : fileToLoad,
          uri    : $("#modal-load-input-uri").val(),
          type   : $("#modal-load-tab-list li.active").data('type')
        }
        console.log(formData);
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
        fileToLoad = '';
    });


    $('.action-editcolumn').click(function (e) {
        EditColumnVue.setField($(this).data("column"));
        $('#modal-editcolumn').modal('toggle');
        return false;
    });
    $('#action-editcolumn-save').click(function (e) {
        EditColumnVue.save($(this).data("field"));
        $('#modal-editcolumn').modal('hide');
        return false;
    });
    $('#action-editcolumn-drop').click(function (e) {
        EditColumnVue.drop();
        $('#modal-editcolumn').modal('hide');
        return false;
    });
    $('#action-newtable').click(function() {
        var url = '/' + Faker.lorem.words(3).join('-') + '/';
        $.ajax({
            type: "POST",
            url: url ,
            data: {},
            success: function(data) {
              document.location.href = url;
            }
        });
        return false;
    });
    $('#action-droptable').click(function() {
        alert('Not yet implemented');
        return false;
    });
    $('#action-edittable').click(function() {
        $('#modal-edittable').modal('toggle');
        return false;
    });
    $('#action-edittable-drop').click(function() {
        var url = document.location.pathname.replace(/\/+$/,'').concat('/');
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
    });
    $('#action-edittable-save').click(function() {
        var url = document.location.pathname.replace(/\/+$/,'').concat('/');
        var form = {
          "name": $('#modal-edittable-input-name').val(),
          "title": $('#modal-edittable-input-title').val(),
          "description" : $('#modal-edittable-input-description').val()
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
    });
    $('#action-newcolumn').click(function() {
        var url = document.location.pathname.replace(/\/+$/,'') + '/*/' + Faker.lorem.words(3).join('-') + '/';
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
    $('#action-download-csv').click(function() {
        document.location.href= document.location.pathname.replace(/\/+$/,'') + '/*/?alt=csv';
        return false;
    });
    $('#action-download-nq').click(function() {
        document.location.href= document.location.pathname.replace(/\/+$/,'') + '/*/?alt=nq';
        return false;
    });
    $('#action-download-json').click(function() {
        document.location.href= document.location.pathname.replace(/\/+$/,'') + '/*/?alt=json';
        return false;
    });



    /*
     $('#modal-editcolumn-input-scheme').typeahead({
         local: ['http://schema.org/url','http://schema.org/name','http://schema.org/description','http://schema.org/image']
     });
     */

    $('#modal-edittable-input-description').wysihtml5();

});

