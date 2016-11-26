'use strict';

const mongoose = require('mongoose');
const extend = require('mongoose-schema-extend');
var base = require('../base');

const Role = base.extend({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  type:{type:Number,default:0},
  rights:{type:[]}
});

Role.methods.assign = function () {
  return "name description type rights";
} 

mongoose.model('Role', Role);
