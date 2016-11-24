# LODEX

LODEX is an experimentation aiming to link [ISTEX](http://www.istex.fr) data to the web of data.




## Installation

See the [Installation instructions](Installation.md) page.

## Try it

To run `lodex` with some examples, use:

```bash

$ ./bin/lodex ./example/films/

```


## Settings

### files

You can put your settings in any of these paths:

- `./.lodexrc` (or any upper level repository: `../`, `../../`, *etc*.)
- `$HOME/.lodexrc`
- `$HOME/.lodex/config`
- `$HOME/.config/lodex`
- `$HOME/.config/lodex/config`
- `/etc/lodexrc`
- `/etc/lodex/config`

Or you can pass it:

- in command line arguments,
- in variables prefixed with `lodex`,
- via an option `--config file`, then from that file.

Or you can put your settings in a JSON file besides your data repository (recommended).

For example, if you run `lodex /path/to/repository`, the file will be
`/path/to/repository.json`.

Wherever the settings file is, it is a JSON file.

## parameters

- `connectionURI`: URI to connect to mongoDB (by default: `mongodb://localhost:27017/lodex`)
- `port`: the port the web application will listen (default: `3000`)
- `baseURL`: base URL for the URIs (by default: `http://127.0.0.1:3000`)
- `access`: array of objects containing:
    + `login`
    + `plain`: password in plain text
    + `display`: real name, as displayed in the application
- ...


#### fields

- `datasetFields` describe the fields applying to all collections of the dataset
- `collectionFields` describe the fields applying only to the collection (formerly called table)

Each field should contain:
- `title`: a free title for the field
- `scheme`: the URI of a property (maybe found on the [LoV](http://lov.okfn.org/dataset/lov/))
- `type`: the URI of an [XML Schema type](https://www.w3.org/TR/xmlschema-2/#built-in-primitive-datatypes) (string, boolean, decimal, float, double, duration, dateTime, time, date, ...)
- `content<`: the JBJ stylesheet allowing to set the content of the field (from the raw document)

#### baseURL

To generate non-local URI, you need to set the `baseURL` field in the `config.local.js` (or in the [settings file](#files)), which will replace the `http://127.0.0.1:3000` part of the URIs.

This is useful when lodex can't guess what URL is accessible from your users.
For example, when using the [lodex docker image](https://hub.docker.com/r/inistcnrs/lodex/) and mapping the port to another one.
This happens when using [ezmaster](https://github.com/Inist-CNRS/ezmaster) to instanciate lodex several times.

### Example

Example of minimal `config.local.js` (lacking `datasetFields` and
`collectionFields` configuration):

```javascript
'use strict';
module.exports =
{
  baseURL: 'http://example.lod.istex.fr',
  access: [
    {
      login: 'francois',
      plain: 'c0mpL3XPassW0rD',
      display: 'François Parmentier'
    }
  ]
};

```

Other examples of settings (along with associated data) are available in the [example](https://github.com/Inist-CNRS/lodex/example/) directory.


## Contribute

Here are few indicators of the quality of the code, they can be used as indications on what can be improved:

[![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/lodex/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/lodex)
[![bitHound Dependencies](https://www.bithound.io/github/Inist-CNRS/lodex/badges/dependencies.svg)](https://www.bithound.io/github/Inist-CNRS/lodex/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/Inist-CNRS/lodex/badges/devDependencies.svg)](https://www.bithound.io/github/Inist-CNRS/lodex/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/Inist-CNRS/lodex/badges/code.svg)](https://www.bithound.io/github/Inist-CNRS/lodex/master/files)
[![Docker status](http://dockeri.co/image/inistcnrs/lodex)](https://registry.hub.docker.com/u/inistcnrs/lodex/)

 - To try to understand, see [General specifications](https://docs.google.com/presentation/d/1SpPWMXYkbw9FcTuXC2LFrp6Krfue2_aLkGzYMB4UpoI/pub?start=false&loop=false&delayms=3000)
 - To try to follow, see [![french trello board](https://raw.githubusercontent.com/Inist-CNRS/ezmaster/master/doc/trello_20x20.png) French Trello](https://trello.com/b/7PrF8ckq/lodex-suivi)

