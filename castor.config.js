/*eslint strict: "off", quotes:"off", semi: "off" */
'use strict'
// to allow mongodb host and port injection thanks
// to the MONGODB_PORT environment parameter
// (docker uses it)
var mongoHostPort = process.env.MONGODB_PORT ?
  process.env.MONGODB_PORT.replace('tcp://', '') :
  'localhost:27017';

module.exports = {
  connectionURI: 'mongodb://' + mongoHostPort + '/lodex',
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
  /*  access: [
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
  */
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
    "config.js",
    "echo.js",
    "auth.js",
    "table.js",
    "v3.js"
  ],
  filters: ["jbj-array", "jbj-parse", "jbj-template", "jbj-rdfa"],
  allowedAltValues : ['dry', 'csv', 'jsonld', 'jbj', 'xls', 'tsv', 'html', 'raw']
}
