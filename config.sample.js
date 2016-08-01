/*eslint strict: "off", quotes:"off", semi: "off" */
'use strict'

module.exports = {
  access: [{
    "login": "bob",
    "plain": "dylan",
    "display": "Bob Dylan"
  }],
  "datasetFields": {
    "isRoot": {
      "title": "Is on main page",
      "scheme": "https://schema.org/isAccessibleForFree",
      "type": "https://www.w3.org/TR/xmlschema-2/#boolean",
      "content<": {
        "get": "_root",
        "cast": "boolean",
        "default": false
      }
    },
    "title": {
      "label": "Title",
      "scheme": "http://purl.org/dc/elements/1.1/title",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "lang": "fr",
      "content<": {
        "get": ["_content.json.title", "title", "_label", "_wid"],
        "coalesce": true,
        "first": true
      }
    },
    "name": {
      "title": "Name",
      "scheme": "http://purl.org/dc/terms/identifier",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "content<": {
        "get": "_wid"
      }
    },
    "updated": {
      "title": "Updated",
      "scheme": "http://purl.org/dc/terms/modified",
      "type": "https://www.w3.org/TR/xmlschema-2/#date",
      "content<": {
        "get": "dateSynchronised"
      }
    }
  },
  "collectionFields": {
    "title": {
      "title": "Title",
      "scheme": "http://purl.org/dc/terms/title",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "lang": "fr",
      "content<": {
        "get": ["_content.json.title", "title", "_label", "_wid"],
        "coalesce": true,
        "first": true
      }
    },
    "description": {
      "title": "Description",
      "scheme": "http://purl.org/dc/terms/description",
      "type": "https://www.w3.org/TR/xmlschema-2/#string",
      "lang": "fr",
      "content<": {
        "get": ["_content.json.description", "description", "_text"],
        "coalesce": true,
        "first": true
      }
    },
    "updated": {
      "title": "Updated",
      "scheme": "http://purl.org/dc/terms/modified",
      "type": "https://www.w3.org/TR/xmlschema-2/#date",
      "content<": {
        "get": "dateSynchronised"
      }
    }
  }
}
