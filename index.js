module.exports = {
  browserifyModules: [
    "paperclip/lib/node.js",
    "oboe",
    "url"
  ],
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
  strategies : [
    {
      require : 'local.js',
      options : {
        usernameField : 'username',
        passwordField : 'password',
        accessList : [
          { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] },
          { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
        ]
      }
    }
  ],
  access : [
    {
      pattern : "* /index/**",
      require : "valid-user.js"
    },
    {
      pattern : "post /*/*",
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
  routes: [
    "echo.js",
    "auth.js",
    "table.js",
    "v3.js"
  ]
}
