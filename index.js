module.exports = {
  browserifyModules: [
    "paperclip/lib/node.js",
    "oboe",
    "mongodb-querystring",
    "url"
  ],
  rootURL : '/',
  maxFileSize: 536870912,
  acceptFileTypes: [
    'csv',
    'xml',
    'txt',
    'xls',
    'xlsx',
    'nq',
    'n3',
    'nt',
    'json'
  ],
  access: [
		{
			"login": "bob",
			"plain" : "dylan",
			"display" : "Bob Dylan"
		}
  ],
  strategies : [
    {
      require : 'local.js',
      options : {
        usernameField : 'username',
        passwordField : 'password'
      }
    }
  ],
  authorizations: [
    {
      pattern : "* /index/",
      require : "valid-user.js"
    },
    {
      pattern : "* /index/*",
      require : "valid-user.js"
    }
  ],
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
    {
      pattern : "**/*.json",
      require : "castor-load-jsoncorpus"
    }
  ],
  /*
  models : {
    postColumn : 'post-column.js',
    postTable : 'post-table.js'
  },
  */
  routes: [
    // "set.js",
    "echo.js",
    "auth.js",
    "table.js",
    "v3.js"
  ]
}
