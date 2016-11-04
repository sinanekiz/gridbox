'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const DataTable = require('mongoose-datatable');
const Schema = mongoose.Schema;

DataTable.configure({ verbose: false, debug: false });
mongoose.plugin(DataTable.init);

const baseSchema = new Schema({
    createUser: {
        type: String,
        ref: 'User',
        hideTable: true
    },
    updateUser: {
        type: String,
        ref: 'User',
        hideTable: true
    },
    branch: {
        type: String,
        ref: 'Branch',
        hideTable: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        hideTable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        hideTable: true
    },
    recordStatus: {
        type: Boolean,
        default: true,
        hideTable: true
    }
});

baseSchema.statics.columns = function () {
    var columns = []
    var schm=this.schema;
    this.schema.eachPath(function (path) {
        var attr = schm.paths[path];
        if (attr.options && !attr.options.hideTable) {
            columns.push({ data: path, title: path });
        }
    });
    console.log();

    return columns;
}

baseSchema.statics.createDatatable = function ( action = "datatable") {
    var datatable = {
        processing: true,
        serverSide: true,
        ajax: {
            url: action
        },
        columns: this.columns(),
        serverParams: function (data) { data.bChunkSearch = true; }
    }
    console.log(datatable);
    return datatable;
}

module.exports = baseSchema;
