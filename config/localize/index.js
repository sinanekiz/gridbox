
'use strict';

var Localize = require('localize');

var translate = require("./translate")
var dateFormat = require("./dateFormat")

var myLocalize = new Localize(translate, dateFormat, "all");

exports.configuration = function (request, response, next) {
    var lang = request.session.lang || "en";

    myLocalize.setLocale(lang);

    response.locals.translate = myLocalize.translate
    response.locals.localDate = myLocalize.localDate
    response.locals.strings = translate
    response.locals.user = request.user
    response.locals.session = request.session
    response.locals.objectParser = objectParser;

    next();
}
exports.set = function (req, res) {
    var lang = req.params.lang || "en";
    console.log(req.params.lang)
    myLocalize.setLocale(lang);
    req.session.lang = lang;
    res.redirect('back');
}
exports.js = function (req, res) {
    res.send(Localize.source);
}
exports.localize = myLocalize;



function objectParser(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    s = s.replace("..", ".")
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}