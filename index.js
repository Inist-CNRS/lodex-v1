module.exports = {
  connectionURI: "mongodb://localhost:27017/semtab/",
  browserifyModules: ["paperclip/lib/node.js", "oboe"],
  maxFileSize: 536870912,
  acceptFileTypes: ['csv','xml','txt','xls','xlsx','nq','n3','nt'],
  loaders: [
    {
      pattern : "**/*.xml",
      require : "castor-load-xml"
    },
    {
      pattern : "**/*.csv",
      require : "castor-load-csv"
    },
    {
      pattern : "**/*.xls",
      require : "castor-load-excel"
    },
    {
      pattern : "**/*.xlsx",
      require : "castor-load-excel"
    },
    {
      pattern : "**/*.nq",
      require : "castor-load-nq"
    },
    {
      pattern : "**/*.nt",
      require : "castor-load-nq"
    },
    {
      pattern : "**/*.n3",
      require : "castor-load-nq"
    },
  ],
  routes: [
    "setroot.js",
    "echo.js",
    "table.js",
    "v3.js"
  ]


}
