'use strict';

/**
 * Module dependencies.
 */
const only = require('only');
const { wrap: async } = require('co');
const { respond } = require('../utils');

exports.configure = function (model, controller) {
    return {
        index: async(function* (req, res) {
            var datatables = []
            var datatable = model.createDatatable();
            datatables.push(datatable);

            res.render(controller + '/index', {
                datatables: datatables,
                crud: {
                    create: "/" + controller + "/edit/",
                    update: "/" + controller + "/edit/",
                    delete: "/" + controller + "/delete/",
                    read: "/" + controller + "/edit/",
                }
            });
        }),
        datatable: async(function* (req, res, next) {
            console.log(req.query)
            model.dataTable(req.query, function (err, data) { console.log(data); return res.send(data); });
        }),
        edit: async(function* (req, res) {
            var obj = model.new();
            if (req.params._id) {
                obj = yield model.findOne({ _id: req.params._id }).exec();
            }
            res.render(controller + '/edit', {
                model: obj
            });
        }),
        update: async(function* (req, res) {
            var newobj = model.new(req.body);
            if (req.params._id) {
                yield model.findOne({ _id: req.params._id }).exec(function (err, data) {
                    Object.assign(data, only(req.body, model.assign()));
                    data.save();
                });
            } else {
                yield newobj.save();
            }
            res.redirect("/" + controller + '/index');
        })

    }
}