
'use strict';

var Localize = require('localize');

var translate = require("./translate")
var dateFormat = require("./dateFormat")

var myLocalize = new Localize(translate,dateFormat,"all");

exports.configuration = function (request, response, next) {
    var lang = request.session.lang || "en";
    
    myLocalize.setLocale(lang);

    response.locals.translate = myLocalize.translate
    response.locals.localDate = myLocalize.localDate
    response.locals.strings = myLocalize.strings
    response.locals.lang = lang

    next();
}
exports.set=function(req,res){
    var lang = req.params.lang || "en";
    console.log(req.params.lang)
    myLocalize.setLocale(lang);
    req.session.lang=lang;
    res.redirect('back');
}
exports.js= function (req, res) {
    res.send(Localize.source);
  }
exports.localize=myLocalize;