'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const DataTable = require('mongoose-datatable');
const localize = require('../../config/localize').localize;
const Schema = mongoose.Schema;
const only = require('only');

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
        hideTable: true,
        default: null
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

baseSchema.methods.assign = function () {
    return "";
}


baseSchema.statics.columns = function () {
    var columns = []
    var schm = this.schema;
    this.schema.eachPath(function (path) {
        var attr = schm.paths[path];
        if (attr.options && !attr.options.hideTable) {
            columns.push({ data: path, title: localize.translate(path), name: path });
        }
    });
    return columns;
}


baseSchema.statics.createDatatable = function (action = "datatable") {
    var datatable = {
        processing: true,
        serverSide: true,
        colReorder: true,
        bChunkSearch :true,
        name: "datatable-1",
        dom: '<"top"i<"pull-right"f>>rt<"bottom"l<"pull-right"p>><"clear">',
        ajax: {
            url: action
        },
        scrollX: true,
        buttons: [{
            extend: "print",
            className: "btn dark btn-outline"
        }, {
            extend: "copy",
            className: "btn red btn-outline"
        }, {
            extend: "pdf",
            className: "btn green btn-outline"
        }, {
            extend: "excel",
            className: "btn yellow btn-outline "
        }, {
            extend: "csv",
            className: "btn purple btn-outline "
        }, {
            extend: "colvis",
            className: "btn dark btn-outline",
            text: localize.translate("columns")
        }],
        language: {
            url: "/assets/global/plugins/datatables/languages/" + localize.translate("lng") + ".json"
        },
        columns: this.columns(),
        serverParams: function (data) { data.bChunkSearch = true; }
    }
    return datatable;
}

baseSchema.statics.new = function (newObj) {
    if (newObj) {
        return new this(newObj);
    }
    return new this();
}
 
baseSchema.statics.load = function (options, cb) {
    return this.findOne(options.conditions).exec(cb);
}



baseSchema.statics.list = function (options) {
    const conditions = options.conditions || {};
    conditions.recordStatus = true;
    console.log(conditions);
    return this.find(conditions)
        .sort({ createdAt: -1 })
        .exec();
}

baseSchema.methods.saveChanges = function () {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();
}

module.exports = baseSchema;
