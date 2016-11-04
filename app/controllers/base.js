'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
var model , controller ,action;


exports.configure = function (_model, _controller) {
    model = _model;
    controller = _controller;
}

//index

exports.index = async(function* (req, res) {
    var datatables = []
    var datatable = model.createDatatable();
    datatables.push(datatable);

    res.render(controller+'/index', {
        datatables: datatables
    });
});

//datatable

exports.datatable = async(function* (req, res, next) {
    model.dataTable(req.query, function (err, data) { return res.send(data); });
});