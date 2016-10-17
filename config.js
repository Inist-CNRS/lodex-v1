/*eslint strict: "off", quotes:"off", semi: "off" */
'use strict'
//
// ATTENTION :Les variables de configuration suivantes ne peuvent pas être surchargée localement.
// les valeurs par défaut, donc modifiable localement, sont défnies dans le fichier index.js
module.exports = {
  maxFileSize: 536870912,
  collectionNameHotFolder : 'data',
  defaultRootCollection: 'data',
  mimeTypes : {
    'text/plain' : [
      'trig',
      'n3',
      'nq',
      'ttl'
    ],
    "application/json" : [
      'json',
      'jsonad',
      'jsonld',
      'raw',
      'jbj',
      'dry',
      'min'
    ]
  },
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
  ],*/
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
      pattern : "* /backoffice.html",
      require : "valid-user.js"
    }
  ],
  loaders: [
    {
      pattern : "**/*.table",
      require : "table"
    },
    {
      pattern : "**/*.xml",
      require : "castor-load-xml"
    },
    {
      pattern : "**/*.tsv",
      require : "castor-load-csv",
      options : {
        separator : "\t"
      }
    },
    {
      pattern : "**/*.csv",
      require : "castor-load-csv",
      options : {
        separator : ","
      }
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
  routes: [
    "status.js",
    "config.js",
    "echo.js",
    "auth.js",
    "rest-crud.js",
    "pages.js"
  ],
  filters: [
    "jbj-array",
    "jbj-misc.js",
    "jbj-nlp",
    "jbj-numerical",
    "jbj-parse",
    "jbj-rdfa",
    "jbj-template"
  ],
  downloaders: [
    {
      pattern : '*',
      require : 'jsonld.js'
    },
    {
      pattern : 'csv',
      require : 'csv.js'
    },
    {
      pattern : '+(xls|xlsx)',
      require : 'excel.js'
    },
    {
      pattern : 'nq',
      require : 'nquads.js'
    },
    {
      pattern : 'n3',
      require : 'n3.js'
    },
    {
      pattern : 'ttl',
      require : 'ttl.js'
    },
    {
      pattern : 'trig',
      require : 'trig.js'
    },
    {
      pattern : '+(jsonld|min)',
      require : 'export.js'
    },
    {
      pattern : '+(jsonad|html|iframe)',
      require : 'format.js'
    },
    {
      pattern : '+(jsonad|html)',
      require : 'enrich.js'
    },
    {
      pattern : 'iframe',
      require : 'iframe.js'
    },
    {
      pattern : 'html',
      require : 'render.js'
    }
  ]
}
