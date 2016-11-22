'use strict';
var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('lodex:' + basename)
  , errlog = require('debug')('lodex:' + basename + ':error')
  , util = require('util')
  , minimist = require('minimist')
  , portfinder = require('portfinder')
  , kuler = require('kuler')
  , os = require('os')
  , fs = require('fs')
  , server = require('./server.js')
  ;

module.exports = function(warmup) {

  // very important : if not set, 'request' use proxy for internal calls
  if (!process.env['no_proxy']) {
    process.env['no_proxy'] = '127.0.0.1,localhost';
  }
  else {
    process.env['no_proxy'] = '127.0.0.1,localhost,' + process.env['no_proxy'];
  }

  if (!process.env['NO_PROXY']) {
    process.env['NO_PROXY'] = '127.0.0.1,localhost';
  }
  else {
    process.env['NO_PROXY'] = '127.0.0.1,localhost,' + process.env['NO_PROXY'];
  }

  var argv = minimist(process.argv.slice(2), {
    alias: {
      n: 'dry-run',
      h: 'help',
      V: 'version',
      v: 'verbose',
      d: 'debug'
    },
    boolean: ['help', 'version', 'verbose', 'debug', 'dry-run']
  });

  var appname = path.basename(process.argv[1]);
  var baseurl;
  var usage = [
    'Usage: ' + appname  + ' [options...] <path>',
    '',
    'Options:',
    '\t -h, --help          Show usage and exit',
    '\t -n, --dry-run       Show config and exit',
    '\t -v, --verbose       Make the operation more talkative',
    '\t -V, --version       Show version number and quit',
    '',
    'It will look in all the obvious places to set the configuration:',
    ' - command line arguments',
    ' - environment variables prefixed with ' + appname + '_',
    ' - if you passed an option --config file then from that file',
    ' - a local .' + appname + 'rc or the first found looking in ./ ../ ../../ ../../../ etc.',
    ' - $HOME/.' + appname + 'rc',
    ' - $HOME/.' + appname + '/config',
    ' - $HOME/.config/' + appname + '',
    ' - $HOME/.config/' + appname + '/config',
    ' - /etc/' + appname + 'rc',
    ' - /etc/' + appname + '/config',
    ' - ' + process.cwd() + '/config.local.json',
    ' - ' + process.cwd() + '/config.local.js',
    ' - {dataPath}.json',
    ' - {dataPath}.js',
  ].join('\n')
  ;


  if (argv.help) {
    console.info(usage);
    process.exit(0);
  }

  if (argv.version) {
    console.info(require('../package.json').version);
    process.exit(0);
  }

  // if (!argv.verbose) {
  //   console.log = require('debug')('console:log');
  // }

  //
  // Environement vars
  //
  // Docker and/or ezmaster
  //
  var mongoHostPort;

  mongoHostPort = process.env.MONGODB_PORT
  ? process.env.MONGODB_PORT.replace('tcp://', '')
  : 'localhost:27017';

  mongoHostPort = process.env.EZMASTER_MONGODB_HOST_PORT
  ? process.env.EZMASTER_MONGODB_HOST_PORT.replace('tcp://', '')
  : mongoHostPort;


  appname = process.env.EZMASTER_TECHNICAL_NAME
  ? process.env.EZMASTER_TECHNICAL_NAME
  : appname;

  baseurl = process.env.EZMASTER_PUBLIC_URL
  ? process.env.EZMASTER_PUBLIC_URL
  : baseurl;

  //
  // Default config parameters
  //
  var Configurator = require('./helpers/configurator.js');
  var config = new Configurator();
  config.fix('cleanAtStartup',        true);
  config.fix('databaseHost',         mongoHostPort);
  config.fix('databaseName',         appname);
  config.fix('collectionNameIndex',     'index');
  config.fix('collectionNameHotFields', 'hotfields');
  config.fix('collectionNameHotFolder', 'hotfolder');
  config.fix('defaultRootCollection', 'index');
  config.fix('debug',                false);
  config.fix('trustProxy',           false);
  config.fix('defaultEngine',        'html');
  config.fix('port',                 '3000');
  config.fix('timeout',              120000);
  config.fix('delay',                250);
  config.fix('logFormat',            'combined');
  config.fix('title',                'Index of the dataset');
  config.fix('description',          'The dataset contains collections.');
  config.fix('itemsPerPage',         30);
  config.fix('maxAge',               '1 day');
  config.fix('concurrency',          os.cpus().length);
  config.fix('writeConcern',         1);
  config.fix('rootURL',              '/corpus.html');
  config.fix('loginURL',             '/login.html');
  config.fix('baseURL',              baseurl);
  config.fix('prefixURL',            ''); // ex: /server1
  config.fix('prefixKEY',            '=');
  config.fix('rootKEY',              'corpus');
  config.fix('maxFileSize',          10485760); // 10 Mo
  config.fix('acceptFileTypes',      []);
  config.fix('defaultAltValue',      'html');
  config.fix('allowedAltValues',     [
    'dry',
    'jdx',
    'min',
    'csv',
    'jsonld',
    'nq',
    'n3',
    'ttl',
    'trig',
    'jbj',
    'xls',
    'tsv',
    'html',
    'jsonad',
    'raw',
    'iframe'
  ]);
  config.fix('mimeTypes',            {});
  config.fix('heartrate',            5000);
  config.fix('filesToIgnore',        [
    '**/.*', '~*', '*~', '*.sw?', '*.old', '*.bak', '**/node_modules', 'Thumbs.db'
  ]);
  config.fix('tempPath',             os.tmpdir());
  config.fix('dataPath',             path.normalize(path.resolve(process.cwd(),
                                     path.normalize(argv._.pop() || './data'))));
  config.fix('viewPath',             path.resolve(__dirname, './app/views/'));
  config.fix('middlewares',          {});
  config.fix('authorizations',       []);
  config.fix('strategies',           []);
  config.fix('models',               {});
  config.fix('filters',              []);
  config.fix('protocols',              []);
  config.fix('engines',              []);
  config.fix('routes',               []);
  config.fix('loaders',              {});
  config.fix('downloaders',          {});
  config.fix('heartbeats',           {});
  config.fix('middlewares',          []);
  config.fix('resources',            {}); // for apiv1
  config.fix('operators',            {});
  // DISABLED config.fix('computedFields',       {});  // JBJ stylesheet to compute fields
  // List of allowed values for 'typ=' parameter
  config.fix('allowedTypValues',     ['uri', 'form', 'file', 'fork']);
  config.fix('datasetFields',        {});
  config.fix('documentFields',       {});
  config.fix('collectionFields',     {
    id: {
      label: 'ID',
      scheme: 'http://purl.org/dc/terms/identifier',
      format: 'uri',
      'content<' : {
        get: '_wid'
      }
    }
  });
  config.fix('uniqueValueWith',       {});
  config.fix('uniqueIdentifierWith',       {});


  config.load(appname, argv);

  if (!fs.existsSync(config.get('dataPath'))) {
    console.info(kuler('Hotfolder is disabled.', 'olive'),
                 kuler('No dataPath specified.', 'orange'));
    config.unset('dataPath');
  }

  // Le chargement de la config local pourrait se faire après le chargement du fichier config.js (cf. app/helpers/view.js)
  // mais le fichier local ne peut pas venir casser la configuration de config.js
  // il est plutot la pour ajouter de nouveaux paramètres propre l'exécution locale de l'application
  var localconfigs = [
    path.normalize(path.join(process.cwd(), 'config.local.js')),
    path.normalize(path.join(process.cwd(), 'config.local.json'))
  ];
  localconfigs.forEach(function(localfile) {
    debug('localfile', localfile);
    if (config.local(localfile)) {
      console.info(kuler('Load local configuration file.', 'olive'), kuler(localfile, 'limegreen'));
    }
  });

  portfinder.basePort = config.get('port');
  portfinder.getPort(function (err, newport) {
    if (err instanceof Error) {
      console.error(kuler('Unable to get a free port. Try to stop some services.', 'red'));
      process.exit(2);
    }
    else {
      config.set('port', newport);
      warmup(config, function(online) {
        //
        // Load conf file attached to dataPath
        //
        if (config.has('dataPath')) {
          var dataconfigs = [
            path.normalize(config.get('dataPath')) + '.json',
            path.normalize(config.get('dataPath')) + '.js'
          ];
          dataconfigs.forEach(function(datafile) {
            if (config.local(datafile)) {
              console.info(kuler('Load local configuration file.', 'olive'),
                           kuler(datafile, 'limegreen'));
            }
          });
        }
        //
        // deduct some vars
        //
        if (!config.has('baseURL')) {
          config.set('baseURL', 'http://127.0.0.1:' + config.get('port'));
        }
        if (config.has('ark')) {
          ///// rootKEY /////
          if (config.has('ark.corpus')) {
            // Ex: ark:/54321/CBA-12345678-9
            config.set('rootKEY', config.get('ark.corpus'));
          }
          else {
            // Ex: ark:/12345/ABC
            config.set('rootKEY',
              'ark:/' + config.get('ark.naan') + '/' + config.get('ark.subpublisher'));
          }

          ///// rootURL /////
          // Ex: http://127.0.0.1:3000/ark:/12345/ABC.html
          //     http://127.0.0.1:3000/ark:/54321/CBA-12345678-9.html
          config.set('rootURL', config.get('baseURL') + '/' + config.get('rootKEY') + '.html');

          ///// prefixKEY /////
          // Ex: ark:/12345
          config.set('prefixKEY', 'ark:/' + config.get('ark.naan'));
        }

        //
        // Default errors tracing
        //
        if (online === undefined || typeof online !== 'function') {
          online = function(err, core) {
            if (err instanceof Error) {
              errlog('Server failed to start', err);
              console.error(kuler('Unable to init the server.', 'red'),
                            kuler('Try to start with DEBUG=*error', 'orangered'));
              process.exit(3);
              return;
            }
            var pack = config.get('package');
            if (pack) {
              console.info(kuler('App detected.', 'olive'),
                           kuler(pack.name + ' ' + pack.version, 'limegreen'));
            }
            if (argv['dry-run']) {
              console.info(String(' ').concat(
                util.inspect(config.config, { showHidden: false, depth: null, colors: true })
                .slice(1, -1)
                .replace(/,\n/g, '\n')
                .replace(/(\s\s\w+:) /g, '$1\t')));
              core.server.close(function() {
                console.info(kuler('Server is not started.', 'olive'),
                             kuler(config.get('baseURL') + '/', 'limegreen'));
                process.exit(0);
              });
            }
            else {
              console.info(kuler('Server is listening.', 'olive'),
                           kuler(config.get('baseURL') + '/', 'limegreen'));
            }
          };
        }

        var srv = server(config, online);

        process.on('SIGINT', function() {
          console.info(kuler('Server is killed.', 'olive'),
                       kuler('Caught SIGINT exiting', 'limegreen'));
          process.exit(1);
        });

        process.on('SIGTERM', function() {
          srv.close(function() {
            console.info(kuler('Server is stopped .', 'olive'),
                         kuler('Caught SIGTERM exiting', 'limegreen'));
            process.exit(1);
          });
        });
      });
    }
  });
};

