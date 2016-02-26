/* global $, document, JSONEditor, nColumns, view */
(function() {
	'use strict';

  /*
    This table was transformed from http://id.loc.gov/vocabulary/iso639-1.tsv,
    after removing first line, replacing \t with ; and replacing \n with \\n
    via this JBJ stylesheet:
    {
      "parseCSVFile": ";",
      "foreach": {
        "get": [1,2]
      },
      "arrays2objects": ["id", "text"]
    }
    It contains the ISO639-1 languages codes, and the associated english labels.
  */
	var isoLanguages = [
	  {
	    "id": "aa",
	    "text": "Afar"
	  },
	  {
	    "id": "ab",
	    "text": "Abkhazian"
	  },
	  {
	    "id": "ae",
	    "text": "Avestan"
	  },
	  {
	    "id": "af",
	    "text": "Afrikaans"
	  },
	  {
	    "id": "ak",
	    "text": "Akan"
	  },
	  {
	    "id": "am",
	    "text": "Amharic"
	  },
	  {
	    "id": "an",
	    "text": "Aragonese"
	  },
	  {
	    "id": "ar",
	    "text": "Arabic"
	  },
	  {
	    "id": "as",
	    "text": "Assamese"
	  },
	  {
	    "id": "av",
	    "text": "Avaric"
	  },
	  {
	    "id": "ay",
	    "text": "Aymara"
	  },
	  {
	    "id": "az",
	    "text": "Azerbaijani"
	  },
	  {
	    "id": "ba",
	    "text": "Bashkir"
	  },
	  {
	    "id": "be",
	    "text": "Belarusian"
	  },
	  {
	    "id": "bg",
	    "text": "Bulgarian"
	  },
	  {
	    "id": "bh",
	    "text": "Bihari languages"
	  },
	  {
	    "id": "bi",
	    "text": "Bislama"
	  },
	  {
	    "id": "bm",
	    "text": "Bambara"
	  },
	  {
	    "id": "bn",
	    "text": "Bengali"
	  },
	  {
	    "id": "bo",
	    "text": "Tibetan"
	  },
	  {
	    "id": "br",
	    "text": "Breton"
	  },
	  {
	    "id": "bs",
	    "text": "Bosnian"
	  },
	  {
	    "id": "ca",
	    "text": "Catalan |  Valencian"
	  },
	  {
	    "id": "ce",
	    "text": "Chechen"
	  },
	  {
	    "id": "ch",
	    "text": "Chamorro"
	  },
	  {
	    "id": "co",
	    "text": "Corsican"
	  },
	  {
	    "id": "cr",
	    "text": "Cree"
	  },
	  {
	    "id": "cs",
	    "text": "Czech"
	  },
	  {
	    "id": "cu",
	    "text": "Church Slavic |  Old Slavonic |  Church Slavonic |  Old Bulgarian |  Old Church Slavonic"
	  },
	  {
	    "id": "cv",
	    "text": "Chuvash"
	  },
	  {
	    "id": "cy",
	    "text": "Welsh"
	  },
	  {
	    "id": "da",
	    "text": "Danish"
	  },
	  {
	    "id": "de",
	    "text": "German"
	  },
	  {
	    "id": "dv",
	    "text": "Divehi |  Dhivehi |  Maldivian"
	  },
	  {
	    "id": "dz",
	    "text": "Dzongkha"
	  },
	  {
	    "id": "ee",
	    "text": "Ewe"
	  },
	  {
	    "id": "el",
	    "text": "Greek, Modern (1453-)"
	  },
	  {
	    "id": "en",
	    "text": "English"
	  },
	  {
	    "id": "eo",
	    "text": "Esperanto"
	  },
	  {
	    "id": "es",
	    "text": "Spanish |  Castilian"
	  },
	  {
	    "id": "et",
	    "text": "Estonian"
	  },
	  {
	    "id": "eu",
	    "text": "Basque"
	  },
	  {
	    "id": "fa",
	    "text": "Persian"
	  },
	  {
	    "id": "ff",
	    "text": "Fulah"
	  },
	  {
	    "id": "fi",
	    "text": "Finnish"
	  },
	  {
	    "id": "fj",
	    "text": "Fijian"
	  },
	  {
	    "id": "fo",
	    "text": "Faroese"
	  },
	  {
	    "id": "fr",
	    "text": "French"
	  },
	  {
	    "id": "fy",
	    "text": "Western Frisian"
	  },
	  {
	    "id": "ga",
	    "text": "Irish"
	  },
	  {
	    "id": "gd",
	    "text": "Gaelic |  Scottish Gaelic"
	  },
	  {
	    "id": "gl",
	    "text": "Galician"
	  },
	  {
	    "id": "gn",
	    "text": "Guarani"
	  },
	  {
	    "id": "gu",
	    "text": "Gujarati"
	  },
	  {
	    "id": "gv",
	    "text": "Manx"
	  },
	  {
	    "id": "ha",
	    "text": "Hausa"
	  },
	  {
	    "id": "he",
	    "text": "Hebrew"
	  },
	  {
	    "id": "hi",
	    "text": "Hindi"
	  },
	  {
	    "id": "ho",
	    "text": "Hiri Motu"
	  },
	  {
	    "id": "hr",
	    "text": "Croatian"
	  },
	  {
	    "id": "ht",
	    "text": "Haitian |  Haitian Creole"
	  },
	  {
	    "id": "hu",
	    "text": "Hungarian"
	  },
	  {
	    "id": "hy",
	    "text": "Armenian"
	  },
	  {
	    "id": "hz",
	    "text": "Herero"
	  },
	  {
	    "id": "ia",
	    "text": "Interlingua (International Auxiliary Language Association)"
	  },
	  {
	    "id": "id",
	    "text": "Indonesian"
	  },
	  {
	    "id": "ie",
	    "text": "Interlingue |  Occidental"
	  },
	  {
	    "id": "ig",
	    "text": "Igbo"
	  },
	  {
	    "id": "ii",
	    "text": "Sichuan Yi |  Nuosu"
	  },
	  {
	    "id": "ik",
	    "text": "Inupiaq"
	  },
	  {
	    "id": "io",
	    "text": "Ido"
	  },
	  {
	    "id": "is",
	    "text": "Icelandic"
	  },
	  {
	    "id": "it",
	    "text": "Italian"
	  },
	  {
	    "id": "iu",
	    "text": "Inuktitut"
	  },
	  {
	    "id": "ja",
	    "text": "Japanese"
	  },
	  {
	    "id": "jv",
	    "text": "Javanese"
	  },
	  {
	    "id": "ka",
	    "text": "Georgian"
	  },
	  {
	    "id": "kg",
	    "text": "Kongo"
	  },
	  {
	    "id": "ki",
	    "text": "Kikuyu |  Gikuyu"
	  },
	  {
	    "id": "kj",
	    "text": "Kuanyama |  Kwanyama"
	  },
	  {
	    "id": "kk",
	    "text": "Kazakh"
	  },
	  {
	    "id": "kl",
	    "text": "Kalaallisut |  Greenlandic"
	  },
	  {
	    "id": "km",
	    "text": "Central Khmer"
	  },
	  {
	    "id": "kn",
	    "text": "Kannada"
	  },
	  {
	    "id": "ko",
	    "text": "Korean"
	  },
	  {
	    "id": "kr",
	    "text": "Kanuri"
	  },
	  {
	    "id": "ks",
	    "text": "Kashmiri"
	  },
	  {
	    "id": "ku",
	    "text": "Kurdish"
	  },
	  {
	    "id": "kv",
	    "text": "Komi"
	  },
	  {
	    "id": "kw",
	    "text": "Cornish"
	  },
	  {
	    "id": "ky",
	    "text": "Kirghiz |  Kyrgyz"
	  },
	  {
	    "id": "la",
	    "text": "Latin"
	  },
	  {
	    "id": "lb",
	    "text": "Luxembourgish |  Letzeburgesch"
	  },
	  {
	    "id": "lg",
	    "text": "Ganda"
	  },
	  {
	    "id": "li",
	    "text": "Limburgan |  Limburger |  Limburgish"
	  },
	  {
	    "id": "ln",
	    "text": "Lingala"
	  },
	  {
	    "id": "lo",
	    "text": "Lao"
	  },
	  {
	    "id": "lt",
	    "text": "Lithuanian"
	  },
	  {
	    "id": "lu",
	    "text": "Luba-Katanga"
	  },
	  {
	    "id": "lv",
	    "text": "Latvian"
	  },
	  {
	    "id": "mg",
	    "text": "Malagasy"
	  },
	  {
	    "id": "mh",
	    "text": "Marshallese"
	  },
	  {
	    "id": "mi",
	    "text": "Maori"
	  },
	  {
	    "id": "mk",
	    "text": "Macedonian"
	  },
	  {
	    "id": "ml",
	    "text": "Malayalam"
	  },
	  {
	    "id": "mn",
	    "text": "Mongolian"
	  },
	  {
	    "id": "mr",
	    "text": "Marathi"
	  },
	  {
	    "id": "ms",
	    "text": "Malay"
	  },
	  {
	    "id": "mt",
	    "text": "Maltese"
	  },
	  {
	    "id": "my",
	    "text": "Burmese"
	  },
	  {
	    "id": "na",
	    "text": "Nauru"
	  },
	  {
	    "id": "nb",
	    "text": "Bokmål, Norwegian |  Norwegian Bokmål"
	  },
	  {
	    "id": "nd",
	    "text": "Ndebele, North |  North Ndebele"
	  },
	  {
	    "id": "ne",
	    "text": "Nepali"
	  },
	  {
	    "id": "ng",
	    "text": "Ndonga"
	  },
	  {
	    "id": "nl",
	    "text": "Dutch |  Flemish"
	  },
	  {
	    "id": "nn",
	    "text": "Norwegian Nynorsk |  Nynorsk, Norwegian"
	  },
	  {
	    "id": "no",
	    "text": "Norwegian"
	  },
	  {
	    "id": "nr",
	    "text": "Ndebele, South |  South Ndebele"
	  },
	  {
	    "id": "nv",
	    "text": "Navajo |  Navaho"
	  },
	  {
	    "id": "ny",
	    "text": "Chichewa |  Chewa |  Nyanja"
	  },
	  {
	    "id": "oc",
	    "text": "Occitan (post 1500)"
	  },
	  {
	    "id": "oj",
	    "text": "Ojibwa"
	  },
	  {
	    "id": "om",
	    "text": "Oromo"
	  },
	  {
	    "id": "or",
	    "text": "Oriya"
	  },
	  {
	    "id": "os",
	    "text": "Ossetian |  Ossetic"
	  },
	  {
	    "id": "pa",
	    "text": "Panjabi |  Punjabi"
	  },
	  {
	    "id": "pi",
	    "text": "Pali"
	  },
	  {
	    "id": "pl",
	    "text": "Polish"
	  },
	  {
	    "id": "ps",
	    "text": "Pushto |  Pashto"
	  },
	  {
	    "id": "pt",
	    "text": "Portuguese"
	  },
	  {
	    "id": "qu",
	    "text": "Quechua"
	  },
	  {
	    "id": "rm",
	    "text": "Romansh"
	  },
	  {
	    "id": "rn",
	    "text": "Rundi"
	  },
	  {
	    "id": "ro",
	    "text": "Romanian |  Moldavian |  Moldovan"
	  },
	  {
	    "id": "ru",
	    "text": "Russian"
	  },
	  {
	    "id": "rw",
	    "text": "Kinyarwanda"
	  },
	  {
	    "id": "sa",
	    "text": "Sanskrit"
	  },
	  {
	    "id": "sc",
	    "text": "Sardinian"
	  },
	  {
	    "id": "sd",
	    "text": "Sindhi"
	  },
	  {
	    "id": "se",
	    "text": "Northern Sami"
	  },
	  {
	    "id": "sg",
	    "text": "Sango"
	  },
	  {
	    "id": "si",
	    "text": "Sinhala |  Sinhalese"
	  },
	  {
	    "id": "sk",
	    "text": "Slovak"
	  },
	  {
	    "id": "sl",
	    "text": "Slovenian"
	  },
	  {
	    "id": "sm",
	    "text": "Samoan"
	  },
	  {
	    "id": "sn",
	    "text": "Shona"
	  },
	  {
	    "id": "so",
	    "text": "Somali"
	  },
	  {
	    "id": "sq",
	    "text": "Albanian"
	  },
	  {
	    "id": "sr",
	    "text": "Serbian"
	  },
	  {
	    "id": "ss",
	    "text": "Swati"
	  },
	  {
	    "id": "st",
	    "text": "Sotho, Southern"
	  },
	  {
	    "id": "su",
	    "text": "Sundanese"
	  },
	  {
	    "id": "sv",
	    "text": "Swedish"
	  },
	  {
	    "id": "sw",
	    "text": "Swahili"
	  },
	  {
	    "id": "ta",
	    "text": "Tamil"
	  },
	  {
	    "id": "te",
	    "text": "Telugu"
	  },
	  {
	    "id": "tg",
	    "text": "Tajik"
	  },
	  {
	    "id": "th",
	    "text": "Thai"
	  },
	  {
	    "id": "ti",
	    "text": "Tigrinya"
	  },
	  {
	    "id": "tk",
	    "text": "Turkmen"
	  },
	  {
	    "id": "tl",
	    "text": "Tagalog"
	  },
	  {
	    "id": "tn",
	    "text": "Tswana"
	  },
	  {
	    "id": "to",
	    "text": "Tonga (Tonga Islands)"
	  },
	  {
	    "id": "tr",
	    "text": "Turkish"
	  },
	  {
	    "id": "ts",
	    "text": "Tsonga"
	  },
	  {
	    "id": "tt",
	    "text": "Tatar"
	  },
	  {
	    "id": "tw",
	    "text": "Twi"
	  },
	  {
	    "id": "ty",
	    "text": "Tahitian"
	  },
	  {
	    "id": "ug",
	    "text": "Uighur |  Uyghur"
	  },
	  {
	    "id": "uk",
	    "text": "Ukrainian"
	  },
	  {
	    "id": "ur",
	    "text": "Urdu"
	  },
	  {
	    "id": "uz",
	    "text": "Uzbek"
	  },
	  {
	    "id": "ve",
	    "text": "Venda"
	  },
	  {
	    "id": "vi",
	    "text": "Vietnamese"
	  },
	  {
	    "id": "vo",
	    "text": "Volapük"
	  },
	  {
	    "id": "wa",
	    "text": "Walloon"
	  },
	  {
	    "id": "wo",
	    "text": "Wolof"
	  },
	  {
	    "id": "xh",
	    "text": "Xhosa"
	  },
	  {
	    "id": "yi",
	    "text": "Yiddish"
	  },
	  {
	    "id": "yo",
	    "text": "Yoruba"
	  },
	  {
	    "id": "za",
	    "text": "Zhuang |  Chuang"
	  },
	  {
	    "id": "zh",
	    "text": "Chinese"
	  },
	  {
	    "id": "zu",
	    "text": "Zulu"
	  }
	];


	$(document).ready(function() {
		var JSONEditorOptions = { mode: "code", maxLines: Infinity };
		var oboe = require('oboe');
		var JURL = require('url');
		var nTables = 0;

		var je0, je1, je2, je3, je4, je5;

		/**
		 * View
		 *
		 */
		var viewLoomInternal = view('template-modal-loom-internal', function() {
			var url = JURL.parse(window.location.href.replace(/\/+$/, ''));
			url.pathname = url.path = '/index/*';
			viewLoomInternal.set('items', []);
			viewLoomInternal.set('rightTable', document.location.pathname.replace(/\/+$/, '').split('/').slice(1).shift());
			viewLoomInternal.set('leftTable', document.location.pathname.replace(/\/+$/, '').replace(/^\/+/, ''));
			oboe(JURL.format(url))
			.node('!.*', function(item) {
				var items = viewLoomInternal.get('items');
				items.push(item);
				viewLoomInternal.set('items', items);
			});
			$("#modal-loom-internal-select").change(function() {
				$("option:selected", this).each(function() {
					viewLoomInternal.set('rightTable', $(this).data('value'));
				});
			})
		});



		/**
		 * View
		 *
		 */
		var viewLoom = view('template-modal-loom', function() {
			$(".modal-loom").on("show.bs.modal", function() {
				$("#modal-loom").modal('hide');
			});
			$("#modal-loom").on("show.bs.modal", function() {
				var height = $(window).height() / 2;
				$(".modal-column").css("max-height", Math.round(height));
				$("#modal-loom-internal").modal('hide');


				var url = JURL.parse(window.location.href);

				viewLoom.set('leftColumns', []);
				url.pathname = String('/index/').concat(viewLoomInternal.get('leftTable')).concat('/*');
				url.query = { "alt": "raw" };
				oboe(JURL.format(url)).done(function(items) {
					var cols = Object.keys(items[0]._columns).map(function(x) {
						return { value: x, label: items[0]._columns[x].label } });
					viewLoom.set('leftColumnName', cols[0].value);
					viewLoom.set('leftColumns', cols)
				});

				viewLoom.set('rightColumns', []);
				url.pathname = String('/index/').concat(viewLoomInternal.get('rightTable')).concat('/*');
				url.query = { "alt": "raw" };
				oboe(JURL.format(url)).done(function(items) {
					var cols = Object.keys(items[0]._columns).map(function(x) {
						return { value: x, label: items[0]._columns[x].label } });
					viewLoom.set('rightColumnName', cols[0].value);
					viewLoom.set('rightColumns', cols)
				});

				viewLoom.reloadRight = function() {
					viewLoom.set('rightItems', []);
					var url = JURL.parse(window.location.href);
					url.pathname = String('/').concat(viewLoomInternal.get('rightTable')).concat('/*');
					oboe(JURL.format(url))
						.node('!.*', function(item) {
							var name = viewLoom.get('rightColumnName');
							var items = viewLoom.get('rightItems');
							items.push(item[name]);
							viewLoom.set('rightItems', items);
						});
				}
				viewLoom.reloadRight();


				viewLoom.reloadLeft = function() {
					viewLoom.set('leftItems', []);
					var url = JURL.parse(window.location.href);
					url.pathname = String('/').concat(viewLoomInternal.get('leftTable')).concat('/*');
					oboe(JURL.format(url))
					.node('!.*', function(item) {
						var name = viewLoom.get('leftColumnName');
						var items = viewLoom.get('leftItems');
						items.push(item[name]);
						viewLoom.set('leftItems', items);
					});
				}
				viewLoom.reloadLeft();

			});
		}, {
			handleChangeLeft: function(event) {
				viewLoom.set('leftColumnName', $(this).find(":selected").data('value'));
				viewLoom.reloadLeft();
				return false;
			},
			handleChangeRight: function(event) {
				viewLoom.set('rightColumnName', $(this).find(":selected").data('value'));
				viewLoom.reloadRight();
				return false;
			}

		});



		/**
		 * View
		 *
		 */
		var viewList = view('template-table-items-list', function() {
			viewList.reload = function() {
				viewList.set('page', 1);
				viewList.set('items', []);
				viewList.load();
			}
			viewList.load = function() {
				var first = true;
				var url = JURL.parse(viewList.get('url'));
				var limit = 30;
				var page = Number(viewList.get('page'));
				page = Number.isNaN(page) ? 1 : page;
				var offset = limit * (page - 1)
				url.query = {
					"orderby": viewSort.get('field') + ' ' + viewSort.get('order'),
					"limit": String(offset).concat(',').concat(String(limit))
				}
				oboe(JURL.format(url))
				.node('!.*', function(item) {
					var items = viewList.get('items');
					items.push(item);
					viewList.set('items', items);
					if (first) {
						// viewColumn.set('sampleURL', encodeURIComponent(window.location.href.replace(/\/+$/,'').concat('/').concat(item._wid).concat('/*?alt=raw&firstOnly=1')));
						viewColumn.set('sampleURL', window.location.href.replace(/\/+$/, '').concat('/').concat(item._wid).concat('/*?alt=raw&firstOnly=1'));
						viewColumn.set('sampleStylesheet', encodeURIComponent(JSON.stringify({})));
						first = false;
					}
				})
				.done(function(items) {
					$("#table-items table").resizableColumns();
				});
			}
			viewList.reload();
			$(window).scroll(function() {
				if ($(window).scrollTop() + $(window).height() >= $(document).height() - 300) {
					viewList.set('page', viewList.get('page') + 1);
					viewList.load()
				}
			});
		}, {
			page: 1,
			url: window.location.href.replace(/\/+$/, '') + '/*',
			items: []
		});


		/**
		 * View
		 *
		 */
		var viewRoot = view('template-div-set-root', function() {
			oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/, '') + '/*?alt=raw').done(function(items) {
				viewRoot.set('isRoot', items[0]._root ||  false);
			});
		}, {
			isRoot: false,
			handleToggle: function(event) {
				var idt = document.location.pathname.replace(/\/+$/, '').slice(1);
				var url = '/-/setroot/';
				var form = {
					"origin": idt,
					"isRoot": viewRoot.get('isRoot')
				};
				if (form.isRoot) {
					$.ajax({
						type: "POST",
						url: url,
						data: form,
						error: console.error
					});
				}
				else {
					viewRoot.set('isRoot', true);
				}
				return false;
			}
		});

		/**
		 * View
		 *
		 */
		var viewSort = view('template-div-sort-by', function() {}, {
			field: '_id',
			order: 'asc',
			handleChange: function(event) {
				viewSort.set($(this).attr('name'), $(this).val())
				viewList.reload();
				return false;
			}
		});



		/**
		 * View
		 *
		 */
		var viewTable = view('template-modal-edit-table', function() {
			$('#modal-edittable-input-description').summernote({
				height: 200,
				dialogsInBody: true,
				toolbar: [
					['g2', ['bold', 'italic', 'underline', 'color']],
					['g3', ['clear']],
				]
			});
			$("#modal-edittable").on("show.bs.modal", function() {
				oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/, '') + '/*?alt=raw').done(function(items) {
					viewTable.set('title', items[0]._label);
					viewTable.set('_wid', items[0]._wid);
					je0.set(items[0]._reskey);
					je1.set(items[0]._label);
					je2.set(items[0]._text);
					je3.set(items[0]._hash);
					$("#modal-edittable-input-description").summernote('code', items[0]._text);
					viewRoot.set('isRoot', items[0]._root ||  false);
				});
			});
		}, {
			handleSave: function(event) {
				var url = '/-/v3/settab' + document.location.pathname.replace(/\/+$/, '').concat('/');
				var form = {
					"name": viewTable.get('_wid'),
					"title": viewTable.get('title'),
					"description": $("#modal-edittable-input-description").summernote("code")
				};
				$.ajax({
					type: "POST",
					url: url,
					data: form,
					success: function(data) {
						document.location.href = String('/').concat(form.name);
					}
				});
				return false;
			},
			handleDrop: function(event) {
				var url = '/-/v3/settab' + document.location.pathname.replace(/\/+$/, '').concat('/');
				var form = {};
				form[document.location.pathname.replace(/^\/+/, '').replace(/\/$/, '')] = true;
				$.ajax({
					type: "POST",
					url: url,
					data: form,
					success: function(data) {
						document.location.href = "/";
					}
				});
				return false;
			}
		});


		/**
		 * View
		 *
		 */
		var viewColumn = view('template-modal-edit-column', function() {

			$.fn.modal.Constructor.prototype.enforceFocus = function() {}; // @see https://github.com/select2/select2/issues/1436
			$("#modal-editcolumn-input-scheme").select2({
				theme: "bootstrap",
				width: null,
				placeholder: {
					id: "-1",
					text: "Select an scheme..."
				},
				minimumInputLength: 2,
				ajax: {
					url: "http://lov.okfn.org/dataset/lov/api/v2/term/search",
					dataType: 'json',
					delay: 250,
					data: function(params) {
						return {
							q: params.term,
							page: params.page,
							type: 'property'
						};
					},
					processResults: function(data, params) {
						params.page = params.page || 1;
						// @see http://stackoverflow.com/questions/29035717/select2-load-data-using-ajax-cannot-select-any-option/29082217#29082217
						var select2Data = $.map(data.results, function(obj) {
							obj.id = Array.isArray(obj.uri) ? obj.uri.pop() : '?';
							obj.text = obj.prefixedName;
							return obj;
						});
						return {
							results: select2Data,
							pagination: {
								more: (params.page * 30) < data.total_results
							}
						};
					}
				},
				escapeMarkup: function(markup) { return markup; },
				templateResult: function(row) {
					if (row.loading) {
						return row.text;
					}
					var markup = "<div>";
					markup += "<div>" + row.text + "</div>";
					markup += "<small>" + row.id + "</small>";
					markup += "</div>";
					return markup;
				},
				templateSelection: function(row) {
					return row.id;
				}
			}).change(function() {
				viewColumn.set('scheme', $("#modal-editcolumn-input-scheme").val());
			});

			$("#modal-editcolumn-input-language")
			.select2({
				data: isoLanguages,
				theme: "bootstrap",
				width: "100%"
			})
			.change(function() {
				viewColumn.set('language', $("#modal-editcolumn-input-language").val());
			});

		}, {
			sampleURL: '',
			handleSave: function(event) {
				var idColumn = viewColumn.get('name');
				//var type = $("#modal-editcolumn-tab-list li.active").data('type')
				var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/, '') + '/' + idColumn + '/';

				console.log('before', {
					"previousScheme"  : viewColumn.get('pscheme'),
					"previousValue"   : viewColumn.get('pvalue'),
					"previousName"    : viewColumn.get('pname'),
					"previousLabel"   : viewColumn.get('plabel'),
					"previousLanguage": viewColumn.get('planguage'),
					"previousPrimary" : viewColumn.get('pprimary'),
					"previousComment" : viewColumn.get('pcomment')
				});
				console.log('after', {
					"propertyScheme": $("#modal-editcolumn-input-scheme").val(),
					"propertyValue"   : je5.get(),
					"propertyName"    : idColumn,
					"propertyLabel"   : viewColumn.get('label'),
					"propertyLanguage": viewColumn.get('language'),
					"propertyPrimary" : viewColumn.get('primary'),
					"propertyComment" : viewColumn.get('comment')
				});

				$.ajax({
					type: "POST",
					url: url,
					data: {
						"previousScheme"  : viewColumn.get('pscheme'),
						"previousValue"   : viewColumn.get('pvalue'),
						"previousName"    : viewColumn.get('pname'),
						"previousLabel"   : viewColumn.get('plabel'),
						"previousLanguage": viewColumn.get('planguage'),
						"previousPrimary" : viewColumn.get('pprimary'),
						"previousComment" : viewColumn.get('pcomment'),
						"propertyScheme"  : $("#modal-editcolumn-input-scheme").val(),
						"propertyValue"   : je5.get(),
						"propertyName"    : idColumn,
						"propertyLabel"   : viewColumn.get('label'),
						"propertyLanguage": viewColumn.get('language'),
						"propertyPrimary" : viewColumn.get('primary'),
						"propertyComment" : viewColumn.get('comment')
					},
					success: function(data) {
						document.location.href = document.location.pathname;
					}
				});

				return false;
			},
			handleDrop: function(event) {
				var idColumn = viewColumn.get('name');
				var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/, '') + '/' + idColumn + '/';
				var form = {};
				form[idColumn] = true;
				$.ajax({
					type: "POST",
					url: url,
					data: form,
					success: function(data) {
						document.location.href = document.location.pathname;
					}
				});
				return false;
			},
			handleCrown: function(event) {
        je0.set(je5.get());
				viewLoad.set('typeToLoad', 'fork');
				$("#modal-editcolumn").modal('hide');
        $("#modal-loadtable").modal('show');
			}
		});


		/**
		 * View
		 *
		 */
		var viewLoad = view('template-modal-load-table', function() {
			viewLoad.set('fileToLoad', '');
			$(".modal-loadtable").on("show.bs.modal", function() {
				$("#modal-loadtable").modal('hide');
			})
			$("#modal-loadtable").on("show.bs.modal", function() {
				$("#modal-loadtable-file").modal('hide');
				$("#modal-loadtable-uri").modal('hide');
				$("#modal-loadtable-keyboard").modal('hide');
				$("#modal-loadtable-fork").modal('hide');
			});
		}, {
			handlePrevious: function(event) {
				if (viewLoad.get('typeToLoad') === 'file') {
					$("#modal-loadtable-file").modal('show');
				}
				else if (viewLoad.get('typeToLoad') === 'uri') {
					$("#modal-loadtable-uri").modal('show');
				}
				else if (viewLoad.get('typeToLoad') === 'keyboard') {
					$("#modal-loadtable-keyboard").modal('show');
				}
				else if (viewLoad.get('typeToLoad') === 'fork') {
					$("#modal-loadtable-fork").modal('show');
				}
			},
			handleLoad: function(event) {
				var optData;
				var origin = document.location.pathname.replace(/\/+$/, '').slice(1);
				var typeToLoad = viewLoad.get('typeToLoad');
				if (formatToLoad === 'json') {
					optData = viewLoadType[typeToLoad].get('jsonPath');
				}
				var formData = {
					loader  : formatToLoad,
					keyboard: $('#modal-load-input-keyboard').val(),
					file    : viewLoad.get('fileToLoad'),
					uri     : viewLoadType[typeToLoad].get('source'),
					type    : typeToLoad,
					reskey  : je0.get(),
					label   : je1.get(),
					text    : je2.get(),
					hash    : je3.get(),
					enrich  : je4.get(),
					origin  : origin,
					options : optData
				}
				if (typeToLoad === "fork") {
					var rsc = 't' + (nTables + 1);
					var url = '/-/v3/settab/' + rsc + '/';
					var idt = document.location.pathname.replace(/\/+$/, '').slice(1);
					$.ajax({
						type: "POST",
						url: url,
						data: {
							origin: idt
						},
						success: function(data) {
							formData.uri = '/' + rsc;
							$.ajax({
								type: "POST",
								url: "/-/v3/load",
								data: formData,
								success: function(data) {
									document.location.href = formData.uri;
								}
							});
						},
						error: console.error
					});
				}
				if (formData[formData.type] === undefined || formData[formData.type] === '') {
					return false;
				}
				$.ajax({
					type: "POST",
					url: "/-/v3/load",
					data: formData,
					success: function(data) {
						document.location.href = document.location.pathname;
					}
				});
				viewLoad.get('fileToLoad');
				return false;
			}
		});



		/**
		 * View
		 *
		 */
		var viewPage = view('template-modal-edit-page', function() {
			$('#modal-editpage').on('show.bs.modal', function(e) {
				var idPage = document.location.pathname.replace(/\/+$/, '').split('/').slice(1).shift();
				oboe(window.location.protocol + '//' + window.location.host + '/index/' + idPage + '/*?alt=raw').done(function(items) {
					viewPage.set('_wid', items[0]._wid);
					$('#modal-editpage-input-template').summernote({
						height: 200,
						dialogsInBody: true,
						toolbar: [
							['g1', ['style', 'fontname', 'fontsize']],
							['g2', ['bold', 'italic', 'underline', 'color']],
							['g3', ['clear']],
							['g4', ['paragraph', 'height', 'ol', 'ul', ]],
							['g5', ['strikethrough', 'superscript', 'subscript']],
							['g6', ['link', 'hr', 'picture', 'table']],
							['g7', ['codeview', 'fullscreen']],
						]
					});
					$('#modal-editpage-input-template').summernote('code', items[0]._template);
				});
			});
			$('#modal-editpage').on('hidden.bs.modal', function(e) {
				if (e.target.id != 'modal-editpage') { // ignore events which are raised from child modals
					alert('ignore', e.target.id);
					return false;
				} else {
					return true;
				}
				// your code
			});
		}, {
			handleSave: function(event) {
				var idPage = document.location.pathname.replace(/\/+$/, '').split('/').slice(1).shift();
				var url = String('/-/v3/settab/').concat(idPage).concat('/');
				var form = {
					"name": viewPage.get('_wid'),
					"template": $('#modal-editpage-input-template').summernote('code')
				};
				$.ajax({
					type: "POST",
					url: url,
					data: form,
					success: function(data) {
						document.location.href = document.location.pathname.replace(/\/+$/, '').concat('/');
					}
				});
				return false;
			},
		});



		var viewLoadType = {};
		/**
		 * View
		 *
		 */
		viewLoadType.file = view('template-modal-load-table-file', function() {
			$('#modal-load-input-filename').change(function() {
				var t = $(this).val();
				$('#modal-load-input-file').val(t);
			});
			$('#modal-load-input-filename').fileupload({
				dataType: 'json',
				send: function(e, data) {
					$('#modal-load-input-file-label').hide(4, function() {
						$('#modal-load-input-file-indicator').show().html('0%');
					});
				},
				done: function(error, data) {
					if (Array.isArray(data.result) && data.result[0]) {
						viewLoad.set('fileToLoad', data.result[0]);
					}
					$('#modal-load-input-file-indicator').html('100%');
					$('#modal-load-tab-file > div').addClass("has-success has-feedback");
					$('#modal-load-tab-file .form-control-feedback').show();
					setTimeout(function() {
						$('#modal-load-input-file-indicator').hide(4, function() {
							$('#modal-load-input-file-label').show();
						});
					}, 2500);
				},
				progressall: function(e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('#modal-load-input-file-indicator').html(progress + '%');
				}
			});
			$("#modal-loadtable-file").on("show.bs.modal", function() {
				$(".modal-load-options").hide();
				viewLoad.set('typeToLoad', 'file');
			});
		}, {
			handleSelect: function(event) {
				$('#modal-load-input-filename').click();
			}
		});



		/**
		 * View
		 *
		 */
		viewLoadType.uri = view('template-modal-load-table-uri', function() {
			$("#modal-loadtable-uri").on("show.bs.modal", function() {
				$(".modal-load-options").hide();
				viewLoad.set('typeToLoad', 'uri');
			});
		});


		/**
		 * View
		 *
		 */
		viewLoadType.keyboard = view('template-modal-load-table-keyboard', function() {
			$("#modal-loadtable-keyboard").on("show.bs.modal", function() {
				$(".modal-load-options").hide();
				viewLoad.set('typeToLoad', 'keyboard');
			});
		});


		/**
		 * View
		 *
		 */
		viewLoadType.fork = view('template-modal-load-table-fork', function() {
			$("#modal-loadtable-fork").on("show.bs.modal", function() {
				$(".modal-load-options").hide();
				viewLoad.set('typeToLoad', 'fork');
			});
		});





		/**
		 * Fill variables
		 *
		 */
		oboe(window.location.protocol + '//' + window.location.host + '/index/$count').done(function(items) {
			nTables = items[0].value;
		})

		je0 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-reskey"), JSONEditorOptions);
		je1 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-label"), JSONEditorOptions);
		je2 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-text"), JSONEditorOptions);
		je3 = new JSONEditor(document.getElementById("modal-load-tab2-jsoneditor-hash"), JSONEditorOptions);
		je4 = new JSONEditor(document.getElementById("modal-forktable-enrich"), JSONEditorOptions);
		je5 = new JSONEditor(document.getElementById("modal-editcolumn-jsoneditor-value"), JSONEditorOptions);


		/**
		 * Action
		 *
		 */
		$('.action-editcolumn').click(function(e) {
			var column = $(this).data("column");
			oboe(window.location.protocol + '//' + window.location.host + '/index' + document.location.pathname.replace(/\/+$/, '') + '/*?alt=raw').done(function(items) {
				viewColumn.set('plabel', items[0]._columns[column].label);
				viewColumn.set('label', items[0]._columns[column].label);

				viewColumn.set('pname', column);
				viewColumn.set('name', column);

				viewColumn.set('pscheme', items[0]._columns[column].scheme);
				// @see https://stackoverflow.com/questions/30316586/select2-4-0-0-initial-value-with-ajax/30328989#30328989
				var option = $("<option selected></option>").val(items[0]._columns[column].scheme).text(items[0]._columns[column].scheme);
				$("#modal-editcolumn-input-scheme").append(option).trigger("change");

				viewColumn.set('ptype', items[0]._columns[column].type);
				viewColumn.set('type', items[0]._columns[column].type);

				viewColumn.set('pcomment', items[0]._columns[column].comment);
				viewColumn.set('comment', items[0]._columns[column].comment);

				viewColumn.set('planguage', items[0]._columns[column].language);
				viewColumn.set('language', items[0]._columns[column].language);
				$("#modal-editcolumn-input-language").val(viewColumn.get('language')).trigger('change');

				viewColumn.set('pprimary', items[0]._columns[column].primary);
				viewColumn.set('primary', items[0]._columns[column].primary);


				delete items[0]._columns[column].label;
				delete items[0]._columns[column].comment;
				delete items[0]._columns[column].type;
				delete items[0]._columns[column].scheme;
				delete items[0]._columns[column].primary;
				delete items[0]._columns[column].language;
				viewColumn.set('pvalue', items[0]._columns[column]);
				je5.set(items[0]._columns[column]);
			});
		});



		var formatToLoad;
		$("select.modal-load-shared-type").change(function() {
			$(".modal-load-options").hide();
			$("option:selected", this).each(function() {
				formatToLoad = $(this).val();
				$(".modal-load-options-" + formatToLoad).show();
			});
		})

		/**
		 * Action
		 *
		 */
		$('#action-newtable').click(function() {
			var rsc = 't' + (nTables + 1);
			var url = '/-/v3/settab/' + rsc + '/';
			$.ajax({
				type: "POST",
				url: url,
				data: {},
				success: function(data) {
					document.location.href = '/' + rsc;
				}
			});
			return false;
		});


		/**
		 * Action
		 *
		 */
		$('#action-clonetable').click(function() {
			var rsc = 't' + (nTables + 1);
			var url = '/-/v3/settab/' + rsc + '/';
			var idt = document.location.pathname.replace(/\/+$/, '').slice(1);
			$.ajax({
				type: "POST",
				url: url,
				data: {
					origin: idt
				},
				success: function(data) {
					document.location.href = '/' + rsc;
				}
			});
			return false;
		});


		/**
		 * Action
		 *
		 */
		$('#action-droptable').click(function() {
			alert('Not yet implemented');
			return false;
		});


		/**
		 * Action
		 *
		 */
		$('#action-newcolumn').click(function() {
			var url = '/-/v3/setcol' + document.location.pathname.replace(/\/+$/, '') + '/c' + (nColumns + 1) + '/';
			$.ajax({
				type: "POST",
				url: url,
				data: {},
				success: function(data) {
					document.location.href = document.location.pathname;
				}
			});
			return false;
		});

		/**
		 * Action
		 *
		 */
		$('#action-setroot').click(function() {
			return false;
		});


		/**
		 * Action
		 *
		 */
		$('#action-download-csv').click(function() {
			document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=csv';
			return false;
		});


		/**
		 * Action
		 *
		 */
		$('#action-download-nq').click(function() {
			document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=nq';
			return false;
		});


		/**
		 * Action
		 *
		 */
		$('#action-download-json').click(function() {
			document.location.href = document.location.pathname.replace(/\/+$/, '') + '/*/?alt=json';
			return false;
		});



		/**
		 * Tricks
		 *
		 */
		$(".modal").on("show.bs.modal", function() {
			var height = $(window).height() / 2;
			$(this).find(".modal-body").css("min-height", Math.round(height));
		});

		$(".jsoneditor", function() {
			$(this).find(".outer").css("padding", 0);
			$(this).find(".outer").css("margin", 0);
		});




	});
}());
