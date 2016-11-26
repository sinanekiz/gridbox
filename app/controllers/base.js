'use strict';

/**
 * Module dependencies.
 */
const only = require('only');
const { wrap: async } = require('co');
const { respond, respondOrRedirect } = require('../utils');
const { getBranchConditions } = require('../utils/helper');

exports.configure = function (schema, controller) {

    return {
        findOne: async(function* (req, res, next, _id) {
            const conditions = { _id };
            try {
                req.model = yield schema.load({ conditions });
                if (!req.model) return next(new Error('Record not found'));
            } catch (err) {
                return next(err);
            }
            next();
        }),
        index: async(function* (req, res) {
            var datatables = []
            var datatable = schema.createDatatable();
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
            var options=yield getBranchConditions(req.user,req.currentRight); 
            schema.dataTable(req.query,options, function (err, data) { return res.send(data); });
        }),
        all: async(function* (req, res) {
            var options=yield getBranchConditions(req.user,req.currentRight); 
            var all = yield schema.list(options);
            res.send({ value: all });
        }),
        edit: async(function* (req, res) {
            var model = schema.new();
            if (req.params._id) {
                model = req.model;
            }
            res.render(controller + '/edit', {
                model: model,
                controller: controller
            });
        }),
        post: async(function* (req, res) {
            const model = schema.new(req.body);
            //model.user = req.user;
            //console.log(model)

            try {
                yield model.saveChanges();
                respondOrRedirect({ req, res }, `/${controller}/edit/${model._id}`, {
                    model: model,
                    controller: controller
                }, {
                        type: 'success',
                        text: 'Successfully created model!'
                    });
            } catch (err) {
                respond(res, `${controller}/edit`, {
                    title: 'New ',
                    errors: [err.toString()],
                    model,
                    controller
                }, 422);
            }
        }),
        put: async(function* (req, res) {
            const model = req.model;
            //console.log(req.body)
            Object.assign(model, only(req.body, model.assign()));
            try {
                yield model.saveChanges();
                respondOrRedirect({ req, res }, `/${controller}/edit/${model._id}`, {
                    model: model,
                    controller: controller
                }, {
                        type: 'success',
                        text: 'Successfully updated model!'
                    });
            } catch (err) {
                respond(res, `${controller}/edit`, {
                    title: 'Edit ',
                    errors: [err.toString()],
                    model,
                    controller
                }, 422);
            }
        }),
        delete: async(function* (req, res) {
            yield req.model.remove();
            res.send({
                type: 'info',
                text: 'Deleted successfully'
            });
        })

    }
}