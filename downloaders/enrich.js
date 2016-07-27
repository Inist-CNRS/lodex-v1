'use strict';

var path = require('path')
  , basename = path.basename(__filename, '.js')
  , debug = require('debug')('castor:downloaders:' + basename)
  ;

module.exports = function(options, core) {
  var JBJ = core.jbj;
  options = options || {};
  return function (data, submit) {

    var stylesheet = {
      "$titre" : {
        "get" : ["data._label", "data._wid"],
        "coalesce": true,
        "first" :true,
        "default": "n/a"
      },
      "$description" : {
        "get" : ["data._text", "data._wid"],
        "coalesce": true,
        "first" :true,
        "default": "n/a"
      },
      "$configuration": {
        "get" : "config",
        "mask" : "title,description,themeName"
      },
      "$parametres": {
        "get" : "parameters"
      },
      "$colonnes" : {
        "get" : "data._content.jsonld.@context",
        "foreach" : {
          "inject": {
            "label<" : {
              "get" : "@id",
              "replace#1" : ["http://www.w3.org/2004/02/skos/core#", "skos:"],
              "replace#2" : ["http://www.w3.org/2008/05/skos-xl", "skos-xl:"],
              "replace#3" : ["http://purl.org/dc/elements/1.1/", "dc:"],
              "replace#4" : ["http://purl.org/dc/terms/", "dc:"],
              "replace#5" : ["https://schema.org/", "schema:"],
              "replace#6" : ["http://schema.org/", "schema:"]
            },
            "html<" : {
              "get" : "@id",
              "truncateField": 50,
              "textToHtml": true
            },
            "raw<" : {
              "get" : "@id"
            }
          }

        }
      },
      "$ressource" : {
        "get" : "data._content.jsonld",
        "omit": "@context",
        "foreach" : {
          "inject": {
            "raw<" : {
              "default": 'n/a'
            },
            "html<" : {
              "default": 'n/a',
              "truncateField": 50,
              "textToHtml": true
            }
          }
        }
      },
      "$header.identifiant": {
        "get" : "data._content.jsonld",
        "getJsonLdField" : "http://purl.org/dc/terms/identifier",
        "expect" : {
          "content": "n/a"
        },
        "class" : "fa fa-dollar",
        "tag" : "span"
      },
      "$header.titre": {
        "get" : "data._content.jsonld",
        "getJsonLdField" : "'http://purl.org/dc/terms/title",
        "expect" : {
          "content": "n/a"
        },
        "class" : "fa fa-dollar",
        "tag" : "h1"
      },
      "$header.description": {
        "get" : "data._content.jsonld",
        "getJsonLdField" : "'http://purl.org/dc/terms/description",
        "expect" : {
          "content": "No description available"
        },
        "tag" : "p"
      },
      "$header.createur": {
        "get" : "data._content.jsonld",
        "getJsonLdField" : "'http://purl.org/dc/terms/creator",
        "expect" : {
          "content": "n/a"
        },
        "tag" : "span"
      },
      "$header.misajourle": {
        "get" : "data._content.jsonld",
        "getJsonLdField" : "'http://purl.org/dc/terms/modified",
        "expect" : {
          "content": "n/a"
        },
        "tag" : "span"
      },
      "$header.permalien" : {
        "get" : "data._content.jsonld.@id"
      },
      "$contient" : {
        "inject" : {
          "alt" : "jsonld"
        },
        "querystring" : true,
        "prepend": "http://named-entity.lod.istex.fr/?",
        // "fetch": true,
        // "parseJSON": true
      },
        "$liens.estContenu": {
          "get#1" : "data._content.jsonld",
          "getJsonLdField" : "http://purl.org/dc/terms/isPartOf",
          "get#2" : "content"
        },
        "$liens.contient": {
          "get#1" : "data._content.jsonld",
          "getJsonLdField" : "http://purl.org/dc/terms/hasPart",
          "get#2" : "content"
        },
        "$liens.istex": {
          "get#1" : "data._content.jsonld",
          "getJsonLdField" : "http://purl.org/dc/terms/identifier",
          "get#2" : "content"
        },
        "mask" : "titre,description,configuration,parameters,colonnes,header,ressource,contient,liens"

      }

      debug('JBJ', JBJ.getActions());
      JBJ.render(stylesheet, {data:data}, function(err, res) {
        submit(err, res);
      })
    }
  }
