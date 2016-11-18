'use strict';

const mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');
var base = require('./base');

const Branch = base.extend({
    name: { type: String, default: '' },
    childs:{type: [{
        type: String,
        ref: 'Branch'
    }],
        hideTable: true},
    parent: {
        type: String,
        ref: 'Branch',
        hideTable: true
    },
    province:{type:String}
});

Branch.methods.assign = function () {
    return "name childs parent province";
}

mongoose.model('Branch', Branch);
