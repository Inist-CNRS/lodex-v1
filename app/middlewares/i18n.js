'use strict';

module.exports = function (options) {

  return function (req, res, next) {

    var locales = [];

    // #1 : from Header via Accept-Language
    if (req.i18n.prefLocale) {
      locales.push(req.i18n.prefLocale);
    }
    // #2: from Session
    if (req.session.lang) {
      locales.unshift(req.session.lang);
    }
    // #3: from Parameters
    if (req.query.lang) {
      locales.unshift(req.query.lang.toLowerCase());
    }

    // Set
    req.i18n.setLocale(locales[0] || 'en');

    // Save
    req.session.lang = req.i18n.getLocale();
    req.lang = req.i18n.getLocale();
console.log('req.lang', req.lang);
    next();
  };
};
