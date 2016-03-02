# Converting JSON-LD to a simpler JSON

Using [JBJ](http://inist-cnrs.github.io/jbj-playground/), you can convert `iso639-1.json` into a simpler JSON:

```json
{
  "foreach": {
    "$code": {
      "getproperty": "http://www.w3.org/2004/02/skos/core#notation",
      "get": 0,
      "getproperty#2": "@value"
    },
    "$prefLabels": {
      "getproperty": "http://www.w3.org/2004/02/skos/core#prefLabel",
      "foreach": {
        "$lang": {
          "getproperty": "@language"
        },
        "$text": {
          "getproperty": "@value"
        },
        "mask": "lang,text"
      }
    },
    "mask": "code,prefLabels"
  },
  "array2object": ["code","prefLabels"],
  "foreach#2": {
    "array2object": ["lang","text"]
  }

}
```

This translates:

```json
[{
    "@id": "http://id.loc.gov/vocabulary/iso639-1/oc",
    "@type": ["http://www.loc.gov/mads/rdf/v1#Language", "http://www.loc.gov/mads/rdf/v1#Authority", "http://id.loc.gov/vocabulary/iso639-1/iso639-1_Language", "http://www.w3.org/2004/02/skos/core#Concept"],
    "http://www.loc.gov/mads/rdf/v1#authoritativeLabel": [{
        "@language": "en",
        "@value": "Occitan (post 1500)"
    }, {
        "@language": "fr",
        "@value": "occitan (après 1500)"
    }, {
        "@language": "de",
        "@value": "Okzitanisch"
    }],
    "http://www.w3.org/2000/01/rdf-schema#label": [{
        "@language": "en",
        "@value": "Occitan (post 1500)"
    }, {
        "@language": "fr",
        "@value": "occitan (après 1500)"
    }, {
        "@language": "de",
        "@value": "Okzitanisch"
    }, {
        "@language": "en",
        "@value": "Occitan (post 1500)"
    }, {
        "@language": "fr",
        "@value": "occitan (après 1500)"
    }, {
        "@language": "de",
        "@value": "Okzitanisch"
    }],
    "http://www.loc.gov/mads/rdf/v1#code": [{
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@value": "oc"
    }],
    "http://www.w3.org/2004/02/skos/core#prefLabel": [{
        "@language": "en",
        "@value": "Occitan (post 1500)"
    }, {
        "@language": "fr",
        "@value": "occitan (après 1500)"
    }, {
        "@language": "de",
        "@value": "Okzitanisch"
    }],
    "http://www.w3.org/2004/02/skos/core#notation": [{
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@value": "oc"
    }]
}]
```

into the simpler:

```json
{
  "oc": {
    "en": "Occitan (post 1500)",
    "fr": "occitan (après 1500)",
    "de": "Okzitanisch"
  }
}
```

This stylesheet was used to convert [iso639-1.json](http://id.loc.gov/vocabulary/iso639-1.json) into [lang.json](./lang.json).

## Second stylesheet

But the simple format obtained is hard to exploit with JSONPath.

So, we use this stylesheet:

```json
{
  "foreach": {
    "$code": {
      "getproperty": "http://www.w3.org/2004/02/skos/core#notation",
      "get": 0,
      "getproperty#2": "@value"
    },
    "$prefLabels": {
      "getproperty": "http://www.w3.org/2004/02/skos/core#prefLabel",
      "foreach": {
        "$lang": {
          "getproperty": "@language"
        },
        "$text": {
          "getproperty": "@value"
        },
        "mask": "lang,text"
      },
      "array2object": ["lang","text"]
    },
    "mask": "code,prefLabels"
  }
}
```

which gives:

```json
[
  {
    "code": "oc",
    "prefLabels": {
      "en": "Occitan (post 1500)",
      "fr": "occitan (après 1500)",
      "de": "Okzitanisch"
    }
  }
]
```
