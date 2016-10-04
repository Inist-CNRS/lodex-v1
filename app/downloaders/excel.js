'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:downloaders:' + basename)
  , Excel = require('exceljs')
  ;

module.exports = function(options, core) {
  options = options || {};
  options.width = options.width || 33;

  return {
    breakPipe : true,
    onEach: function (data, submit) {
      var self = this;
      debug('Excel for #', data['_count'][0]);
      if (self.workbook === undefined) {
        self.stream.setHeader('Content-disposition',
                              'attachment; filename=' + self.options.fileName);
        self.workbook = new Excel.stream.xlsx.WorkbookWriter({
          stream: self.stream
        });
        self.worksheet = self.workbook.addWorksheet(data['_collection']['_wid'], 'FFC0000');
        self.worksheet.columns = Object.keys(data['_columns']).map(function(propertyName) {
          return {
            header: data['_columns'][propertyName].title || propertyName,
            key: propertyName,
            width: options.width
          };
        });
      }
      else {
        var row = {};
        Object.keys(data['_columns']).forEach(function(propertyName) {
          row[propertyName] = data['_columns'][propertyName].content || 'not found !';
        });
        self.worksheet.addRow(row).commit();
      }
      submit();
    },
    onEnd:  function(submit) {
      var self = this;
      self.worksheet.commit();
      self.workbook.commit(); // stream is closed, so submit can be ignored
    }
  };
};
