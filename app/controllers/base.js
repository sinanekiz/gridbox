'use strict';

/**
 * Module dependencies.
 */

const { wrap: async } = require('co');
const { respond } = require('../utils');

exports.configure = function (model, controller) {
    return {
        index: async(function* (req, res) {
            var datatables = []
            var datatable = model.createDatatable();
            datatables.push(datatable);

            res.render(controller + '/index', {
                datatables: datatables
            });
        }), datatable :async(function* (req, res, next) {
            console.log(req.query)
            model.dataTable(req.query, function (err, data) { console.log(data); return res.send(data); });
        })
    }
}