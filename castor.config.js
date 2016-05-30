/*eslint strict: "off", quotes:"off", semi: "off" */
'use strict'

module.exports = {
  browserifyModules: [
    "paperclip/lib/node.js",
    "oboe",
    "mongodb-querystring",
    "url",
    "components/backoffice"
  ],
  browserifyTransformers: [
    'vueify'
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
      pattern : "* /index/",
      require : "valid-user.js"
    },
    {
      pattern : "* /index/*",
      require : "valid-user.js"
    },
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
    "v3.js",
    "rest-crud.js"
  ],
  filters: ["jbj-array", "jbj-parse", "jbj-template", "jbj-rdfa", "jbj-nlp"],
  allowedAltValues : ['dry', 'csv', 'jsonld', 'nq', 'nq.xlsx', 'jbj', 'xls', 'tsv', 'html', 'raw'],
  "indexColumns" : {
    "isRoot" : {
      "label" : "Is on main page",
      "scheme" : "https://schema.org/isAccessibleForFree",
      "type": "https://www.w3.org/TR/xmlschema-2/#boolean",
      "get" : "_root",
      "cast": "boolean",
      "default" : false
    },
    "title" : {
      "label" : "Title",
      "scheme" : "http://purl.org/dc/elements/1.1/title",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "get": ["_content.json.title", "title", "_label", "_wid"],
      "coalesce": true,
      "first" : true
    },
    "name" : {
      "label" : "Name",
      "scheme" : "http://purl.org/dc/terms/identifier",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "get" : "_wid"
    },
    "updated" : {
      "label" : "Updated",
      "scheme" : "http://purl.org/dc/terms/modified",
      "type": "https://www.w3.org/TR/xmlschema-2/#date",
      "get" : "dateSynchronised"
    }
  },
  "defaultColumns": {
    "title": {
      "label" : "Title",
      "scheme" : "http://purl.org/dc/terms/title",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "get": ["_content.json.title", "title", "_label", "_wid"],
      "coalesce": true,
      "first" : true
    },
    "description": {
      "label" : "Description",
      "scheme" : "http://purl.org/dc/terms/description",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "get": ["_content.json.description", "description", "_text"],
      "coalesce": true,
      "first" : true
    },
    "updated" : {
      "label" : "Updated",
      "scheme" : "http://purl.org/dc/terms/modified",
      "type": "https://www.w3.org/TR/xmlschema-2/#date",
      "get" : "dateSynchronised"
    }
  }
}
